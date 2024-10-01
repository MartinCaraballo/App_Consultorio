import React, { useState } from 'react';
import {useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

interface PriceModificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PriceModificationModal: React.FC<PriceModificationModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    const [prices, setPrices] = React.useState<Price[]>([]);

    const [priceToSave, setPriceToSave] = React.useState<Price | undefined>(undefined);

    const [addingPrice, setAddingPrice] = React.useState(false);

    const [showMessage, setShowMessage] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('');

    const [hoursToPost, setHoursToPost] = React.useState<number>(0);
    const [pricePerHoursToPost, setPricePerHourToPost] = React.useState<number>(0);

    // Fetch Prices only when the modal is active.
    React.useEffect(() => {
        if (isOpen) {
            fetchPrices();
        }
    }, [isOpen]);

    async function fetchPrices() {
        try {
            const res = await fetch('http://localhost:8080/admin/prices', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            }
            const data = await res.json();
            setPrices(data);
        } catch (e) {
            console.log(e);
        }
    }

    async function addPrice() {
        try {
            const res = await fetch('http://localhost:8080/admin/prices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hours: hoursToPost, pricePerHour: pricePerHoursToPost }),
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            } else if (res.status === 201) {
                setShowMessage(true);
                setStatusMessage("Precio añadido con éxito.")
                fetchPrices();
            } else {
                setShowMessage(true);
                setStatusMessage("Error al intentar agregar el precio.")
            }
            setTimeout(() => setShowMessage(false), 2000);
        } catch (e) {
            console.log(e);
        }
    }

    async function updatePrice(newPrice: Price) {
        try {
            const res = await fetch(`http://localhost:8080/admin/prices`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: newPrice.id, hours: newPrice.hours, pricePerHour: newPrice.pricePerHour }),
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            } else if (res.status === 200) {
                setShowMessage(true);
                setStatusMessage("Precio actualizado con éxito.")
                setPriceToSave(undefined);
                fetchPrices();
            } else {
                setShowMessage(true);
                setStatusMessage("Error al intentar actualizar el precio.")
            }
            setTimeout(() => setShowMessage(false), 2000);
        } catch (e) {
            console.log(e);
        }
    }

    async function deletePrice(id: number) {
        try {
            const res = await fetch(`http://localhost:8080/admin/prices/${id}`,{
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.status === 403) {
                router.push('/login');
            } else if (res.status === 200) {
                setShowMessage(true);
                setStatusMessage("Precio eliminado con éxito.")
                fetchPrices();
            } else {
                setShowMessage(true);
                setStatusMessage("Error al intentar eliminar el precio.")
            }
            setTimeout(() => setShowMessage(false), 2000);
        } catch (e) {
            console.log(e);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Modificar Precios</h1>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <ul className="space-y-2 pb-6">
                    {prices.map((price) => (
                        <li key={price.id} className="p-2 border border-gray-300 rounded-xl flex flex-col lg:flex-row justify-between items-center">
                            <span>{`Horas: ${price.hours}, Precio por Hora: $${price.pricePerHour}`}</span>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    name="hours"
                                    value={priceToSave && priceToSave.id === price.id ? priceToSave.hours : price.hours}
                                    onChange={(e) => {
                                        let newPrice;
                                        let newValue = parseInt(e.target.value);
                                        if (priceToSave && priceToSave.id === price.id) {
                                            newPrice = {...priceToSave, hours: newValue > 144 ? 144 : newValue};
                                        } else {
                                            newPrice = {...price, hours: newValue > 144 ? 144 : newValue};
                                        }
                                        setPriceToSave(newPrice);
                                    }}
                                    placeholder="Horas"
                                    className="border p-1 rounded w-20 mr-2"
                                />
                                <input
                                    type="number"
                                    name="price_per_hour"
                                    value={priceToSave && priceToSave.id === price.id ? priceToSave.pricePerHour : price.pricePerHour}
                                    onChange={(e) => {
                                        let newPrice;
                                        if (priceToSave && priceToSave.id === price.id) {
                                            newPrice = {...priceToSave, pricePerHour: parseInt(e.target.value)};
                                        } else {
                                            newPrice = {...price, pricePerHour: parseInt(e.target.value)};
                                        }
                                        setPriceToSave(newPrice);
                                    }}
                                    placeholder="Precio/Hora"
                                    className="border p-1 rounded w-28 mr-2"
                                />
                                <div className="pr-2">
                                    <button
                                        disabled={!(priceToSave && priceToSave.id === price.id)}
                                        className={`p-1 ${priceToSave && priceToSave.id === price.id ? 'bg-green-500' : 'bg-gray-300'} text-white rounded`}
                                        onClick={() => {
                                            if (priceToSave && priceToSave.id === price.id) {
                                                updatePrice(priceToSave);
                                            }
                                        }}
                                    >
                                        Guardar
                                    </button>
                                </div>
                                <button
                                    onClick={() => deletePrice(price.id)}
                                    className="p-1 bg-red-600 text-white rounded">
                                    <FontAwesomeIcon icon={faTrashCan}/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {addingPrice && (
                    <>
                        <div className="p-2 border-2 rounded-xl text-lg">
                            <span className="text-2xl font-bold">Agregar Precio:</span>
                            <div className="py-2 flex flex-row justify-evenly">
                                <div>
                                    <span className="pr-2">Horas:</span>
                                    <input
                                        type="number"
                                        name="adding-hours"
                                        value={hoursToPost}
                                        onChange={(e) => {
                                            try {
                                                const newValue = parseInt(e.target.value);
                                                setHoursToPost(newValue);
                                            } catch (e) {}
                                        }}
                                        placeholder="Horas"
                                        className="border-2 p-1 rounded-lg w-20 mr-2"
                                    />
                                </div>
                                <div>
                                    <span className="pr-1">Precio por Hora: $</span>
                                    <input
                                        type="number"
                                        name="adding-price-per-hour"
                                        value={pricePerHoursToPost}
                                        onChange={(e) => {
                                            try {
                                                const newValue = parseInt(e.target.value);
                                                setPricePerHourToPost(newValue);
                                            } catch (e) {}
                                        }}
                                        placeholder="Precio/Hora"
                                        className="border-2 p-1 rounded-lg w-20 mr-2"
                                    />
                                </div>
                            </div>
                            <div className="text-center py-2">
                                <button
                                    onClick={() => {
                                        addPrice();
                                        setAddingPrice(false);
                                    }}
                                    className="border-4 p-2 rounded-xl border-green-900 bg-green-500">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </>
                )}
                <div className="text-center p-2">
                    <button
                        onClick={() => setAddingPrice(true)}
                        className="border-2 rounded-full text-4xl w-12 text-white bg-gray-600 border-gray-950 pb-1">
                        +
                    </button>
                </div>
                {showMessage && (
                    <p className={`${statusMessage.includes("éxito") ? 'text-green-500' : 'text-red-500'} text-lg`}>{statusMessage}</p>
                )}
            </div>
        </div>
    );
};

export default PriceModificationModal;