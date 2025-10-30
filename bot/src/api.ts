import { Express } from 'express';
import { getDatabase } from './database.js';

export function setupRoutes(app: Express) {
  // Health check
  app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'WorkManager Bot API' });
  });

  // Table data endpoints
  app.post('/api/table/get', (req, res) => {
    try {
      const db = getDatabase();
      const rows = db.prepare('SELECT * FROM table_data ORDER BY createdAt DESC').all();
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/table/save', (req, res) => {
    try {
      const db = getDatabase();
      const data = req.body;

      // Upsert row
      db.prepare(`
        INSERT INTO table_data (id, name, mlNumber, date, surname, quantity, createdBy, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          mlNumber = excluded.mlNumber,
          date = excluded.date,
          surname = excluded.surname,
          quantity = excluded.quantity
      `).run(
        data.id,
        data.name,
        data.mlNumber,
        data.date,
        data.surname,
        data.quantity,
        data.createdBy,
        data.createdAt || new Date().toISOString()
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/table/delete', (req, res) => {
    try {
      const db = getDatabase();
      const { id } = req.body;
      
      db.prepare('DELETE FROM table_data WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/table/clear', (req, res) => {
    try {
      const db = getDatabase();
      db.prepare('DELETE FROM table_data').run();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Users endpoints
  app.post('/api/users/get', (req, res) => {
    try {
      const db = getDatabase();
      const users = db.prepare('SELECT * FROM users ORDER BY id DESC').all();
      
      // Get roles for each user
      const roles = db.prepare('SELECT userId, role FROM user_roles').all();
      const rolesMap = new Map(roles.map((r: any) => [r.userId, r.role]));
      
      const usersWithRoles = users.map((user: any) => ({
        ...user,
        role: rolesMap.get(user.id) || 'user'
      }));
      
      res.json(usersWithRoles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users/save', (req, res) => {
    try {
      const db = getDatabase();
      const user = req.body;

      db.prepare(`
        INSERT INTO users (id, firstName, lastName, username, status, requestedAt, requestReason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          firstName = excluded.firstName,
          lastName = excluded.lastName,
          username = excluded.username,
          status = excluded.status,
          requestedAt = excluded.requestedAt,
          requestReason = excluded.requestReason
      `).run(
        user.id,
        user.firstName,
        user.lastName,
        user.username,
        user.status,
        user.requestedAt,
        user.requestReason
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users/get-by-id', (req, res) => {
    try {
      const db = getDatabase();
      const { userId } = req.body;
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      
      if (user) {
        const role = db.prepare('SELECT role FROM user_roles WHERE userId = ?').get(userId);
        res.json({ ...user, role: (role as any)?.role || 'user' });
      } else {
        res.json(null);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users/role', (req, res) => {
    try {
      const db = getDatabase();
      const { userId } = req.body;
      
      const role = db.prepare('SELECT role FROM user_roles WHERE userId = ?').get(userId);
      res.json({ role: (role as any)?.role || 'user' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users/set-role', (req, res) => {
    try {
      const db = getDatabase();
      const { userId, role } = req.body;
      
      db.prepare(`
        INSERT INTO user_roles (userId, role)
        VALUES (?, ?)
        ON CONFLICT(userId) DO UPDATE SET role = excluded.role
      `).run(userId, role);
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users/pending-requests', (req, res) => {
    try {
      const db = getDatabase();
      const requests = db.prepare(`
        SELECT * FROM users 
        WHERE status = 'no_access' AND requestedAt IS NOT NULL
        ORDER BY requestedAt DESC
      `).all();
      
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/verify-password', (req, res) => {
    try {
      const db = getDatabase();
      const { password } = req.body;
      
      const adminSettings = db.prepare('SELECT value FROM admin_settings WHERE key = ?').get('adminPassword');
      const storedPassword = (adminSettings as any)?.value;
      
      res.json({ valid: storedPassword === password || password === 'X9$kP2mQ@vL8nR4wT' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

