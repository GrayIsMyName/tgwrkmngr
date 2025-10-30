import { useState, useEffect } from 'react';
import type { TableRow } from '../types';
import './AddEditForm.css';

interface AddEditFormProps {
  initialData: TableRow | null;
  onSubmit: (data: Omit<TableRow, 'id' | 'createdBy'>) => void;
  onCancel: () => void;
}

export default function AddEditForm({ initialData, onSubmit, onCancel }: AddEditFormProps) {
  const [name, setName] = useState('');
  const [mlNumber, setMlNumber] = useState('');
  const [date, setDate] = useState('');
  const [surname, setSurname] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMlNumber(initialData.mlNumber);
      setDate(initialData.date.split('T')[0]);
      setSurname(initialData.surname);
      setQuantity(initialData.quantity.toString());
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert('Введите наименование');
      return;
    }
    if (!mlNumber.trim()) {
      alert('Введите номер МЛ');
      return;
    }
    if (!date) {
      alert('Выберите дату');
      return;
    }
    if (!surname.trim()) {
      alert('Введите фамилию');
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) < 0) {
      alert('Введите корректное количество (целое число)');
      return;
    }

    onSubmit({
      name: name.trim(),
      mlNumber: mlNumber.trim(),
      date: new Date(date).toISOString(),
      surname: surname.trim(),
      quantity: parseInt(quantity, 10),
    });
  };

  return (
    <div className="form-view">
      <div className="form-header">
        <h2>{initialData ? 'Редактировать строку' : 'Добавить строку'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Наименование *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите наименование"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mlNumber">Номер МЛ *</label>
          <input
            id="mlNumber"
            type="text"
            value={mlNumber}
            onChange={(e) => setMlNumber(e.target.value)}
            placeholder="Введите номер МЛ"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Дата *</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Фамилия *</label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Введите фамилию"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Количество *</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Введите количество"
            min="0"
            step="1"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </form>
    </div>
  );
}

