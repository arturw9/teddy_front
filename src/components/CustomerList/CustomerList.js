import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerList.css'; 
import { FaAd, FaCheck, FaEdit, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom'; 

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);  
    const customersPerPage = 16; 
    const location = useLocation(); 
    const { inputValue } = location.state || {};
    const navigate = useNavigate();  
    const [selectedCustomers, setSelectedCustomers] = useState([]); 


    // Função para buscar clientes da API
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/clientes');
            setCustomers(response.data);
        } catch (err) {
            setError('Erro ao buscar clientes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const openModal = (customer) => {
        setCurrentCustomer(customer); 
        setIsModalOpen(true);  
    };

    const openDeleteModal = (customer) => {
        setCurrentCustomer(customer); 
        setIsDeleteModalOpen(true);  
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);  
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCustomer(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCurrentCustomer(null);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false); 
    };

   
    const toggleCustomerSelection = (customer) => {
    setSelectedCustomers((prevSelectedCustomers) => {
        // Verifica se o cliente já está selecionado
        if (prevSelectedCustomers.includes(customer.id)) {
            // Se já estiver selecionado, remove da lista
            return prevSelectedCustomers.filter((id) => id !== customer.id);
        } else {
            // Caso contrário, adiciona à lista de selecionados
            return [...prevSelectedCustomers, customer.id];
        }
    });
};

    const selectedCount = selectedCustomers.length;

    const validateFields = () => {
        if (!currentCustomer.name || !currentCustomer.salary || !currentCustomer.valorEmpresa) {
            alert('Todos os campos são obrigatórios');
            return false; 
        }
        if (isNaN(currentCustomer.salary) || isNaN(currentCustomer.valorEmpresa)) {
            alert('Salário e valor da empresa devem ser números válidos');
            return false; 
        }
        return true;
    };
    
    const handleUpdate = async () => {
        if (!validateFields()) return; 

        try {
            const updatedSalary = parseFloat(currentCustomer.salary);
            if (isNaN(updatedSalary)) {
                setError('Salário inválido.');
                return;
            }

            const updatedValorEmpresa = parseFloat(currentCustomer.valorEmpresa);
            if (isNaN(updatedValorEmpresa)) {
                setError('Valor da empresa inválido.');
                return;
            }

            await axios.patch(`http://localhost:3000/clientes/${currentCustomer.id}`, {
                name: currentCustomer.name,
                salary: updatedSalary,
                valorEmpresa: updatedValorEmpresa,
            });

            fetchCustomers();
            closeModal();  
        } catch (err) {
            console.error('Erro ao atualizar cliente:', err);
            setError('Erro ao atualizar cliente.');
        }
    };

    const handleDelete = async () => {
    try {
        // Excluir cliente da API
        await axios.delete(`http://localhost:3000/clientes/${currentCustomer.id}`);

        setSelectedCustomers((prevSelectedCustomers) => 
            prevSelectedCustomers.filter((id) => id !== currentCustomer.id)
        );

        fetchCustomers();

        closeDeleteModal();
    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        setError('Erro ao excluir cliente.');
    }
    };

   const handleCreate = async () => {
    if (!currentCustomer?.name || !currentCustomer?.salary || !currentCustomer?.valorEmpresa) {
        alert('Todos os campos (Nome, Salário e Valor da Empresa) devem ser preenchidos.');
        return;  
    }

    if (!validateFields()) return; 

    try {
        const newCustomer = {
            name: currentCustomer.name, 
            salary: parseFloat(currentCustomer.salary),  
            valorEmpresa: parseFloat(currentCustomer.valorEmpresa), 
        };

        await axios.post('http://localhost:3000/clientes', newCustomer);
        fetchCustomers();
        closeCreateModal(); 
    } catch (err) {
        console.error('Erro ao criar cliente:', err);
        setError('Erro ao criar cliente.');
    }
    };

    const currentCustomers = customers.slice((currentPage - 1) * customersPerPage, currentPage * customersPerPage);
    const totalPages = Math.ceil(customers.length / customersPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleExit = () => {
        navigate(-1);
    };

    if (loading) return <p>Carregando clientes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="header-row">
            <img src="/images/logo.jpg" alt="Lista de Clientes" className="title-image" 
              style={{ width: '100px', height: '100px' }} 
              />
                <p class="text-highlight">Clientes</p>
            <p>Clientes selecionados: {selectedCount > 0 && `(${selectedCount})`}</p>
            <button className="input-value" onClick={handleExit}>
                <p className="input-value">Sair</p>     
            </button>
                {inputValue && <p className="input-value">Olá, <strong>{inputValue}</strong></p>}
            </div>
            <div className="customer-cards-container">
                {customers.length === 0 ? (
                    <p className="no-customers">Não há clientes cadastrados.</p>
                ) : (
                    currentCustomers.map((customer) => (
                        <div key={customer.id} className={`customer-card ${selectedCustomers.includes(customer.id) ? 'selected-card' : ''}`}>
                        <h3>{customer.name}</h3>
                        <p>Salário: R$ {customer.salary}</p>
                        <p>Empresa: R$ {customer.valorEmpresa}</p>
                        <div className="card-actions">
                            <a onClick={() => toggleCustomerSelection(customer)}>
                                <FaPlus />
                            </a>
                            <a onClick={() => openModal(customer)}>
                                <FaEdit />
                            </a>
                            <a onClick={() => openDeleteModal(customer)}>
                                <FaTrash />
                            </a>
                        </div>
                    </div>
                    
                    ))
                )}
            </div>

            <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <button className="create-button" onClick={openCreateModal}>
                Criar cliente
            </button>

            {isCreateModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Criar cliente:</h3>
                            <a className="close-modal-button" onClick={closeCreateModal}>
                                <FaTimes />
                            </a>
                        </div>
                            <input
                                placeholder='Digite o nome:'
                                type="text"
                                value={currentCustomer ? currentCustomer.name : ''}
                                onChange={(e) =>
                                    setCurrentCustomer({ ...currentCustomer, name: e.target.value })
                                }
                            />                      
                            <input
                                placeholder='Digite o salário:'
                                type="number"
                                step="any"
                                value={currentCustomer ? currentCustomer.salary : ''}
                                onChange={(e) =>
                                    setCurrentCustomer({ ...currentCustomer, salary: e.target.value })
                                }
                            />
                            <input
                                placeholder='Digite o valor da empresa:'
                                type="number"
                                step="any"
                                value={currentCustomer ? currentCustomer.valorEmpresa : ''}
                                onChange={(e) =>
                                    setCurrentCustomer({ ...currentCustomer, valorEmpresa: e.target.value })
                                }
                            />
                        <button className="save-button" onClick={handleCreate}>
                            Criar cliente
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && currentCustomer && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Editar Cliente:</h3>
                            <a className="close-modal-button" onClick={closeModal}>
                                <FaTimes />
                            </a>
                        </div>
                        <input
                            placeholder='Digite o nome:'
                            type="text"
                            value={currentCustomer ? currentCustomer.name : ''}
                            onChange={(e) =>
                                setCurrentCustomer({ ...currentCustomer, name: e.target.value })
                            }
                        />
                        <input
                            placeholder='Digite o salário:'
                            type="number"
                            step="any"
                            value={currentCustomer ? currentCustomer.salary : ''}
                            onChange={(e) =>
                                setCurrentCustomer({ ...currentCustomer, salary: e.target.value })
                            }
                        />
                        <input
                            placeholder='Digite o valor da empresa:'
                            type="number"
                            step="any"
                            value={currentCustomer ? currentCustomer.valorEmpresa : ''}
                            onChange={(e) =>
                                setCurrentCustomer({ ...currentCustomer, valorEmpresa: e.target.value })
                            }
                        />
                        <button className="save-button" onClick={handleUpdate}>
                            Salvar
                        </button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && currentCustomer && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Excluir Cliente:</h3>
                            <a className="close-modal-button" onClick={closeDeleteModal}>
                                <FaTimes />
                            </a>
                        </div>
                        <p>Tem certeza de que deseja excluir este cliente?</p>
                        <button className="delete-button" onClick={handleDelete}>
                            Excluir
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;