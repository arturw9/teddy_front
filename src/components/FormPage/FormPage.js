import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormPage.css';

const FormPage = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      alert('Por favor, digite o seu nome antes de continuar.');
    } else {
      navigate('/customer-list', { state: { inputValue } });
    }
  };

  return (
    <div className="container">
      <h1 className="title">Olá, seja bem-vindo!</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite o seu nome:"
          className="input"
        />
        <button type="submit" className="button">Entrar</button>
      </form>
    </div>
  );
};

export default FormPage;
