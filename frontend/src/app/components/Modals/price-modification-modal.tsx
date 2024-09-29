// components/PriceModificationModal.tsx
import React, { useState } from 'react';

interface PriceModificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    prices: Price[];
    setPrices: React.Dispatch<React.SetStateAction<Price[]>>;
}

const PriceModificationModal: React.FC<PriceModificationModalProps> = ({ isOpen, onClose, prices, setPrices }) => {
    const [editedPrice, setEditedPrice] = useState<Price | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedPrice) {
            const { name, value } = e.target;
            setEditedPrice({ ...editedPrice, [name]: value ? parseFloat(value) : 0 });
        }
    };

    const handleEdit = (price: Price) => {
        setEditedPrice(price);
    };

    const savePrice = () => {
        if (editedPrice) {
            setPrices(prices.map(price => (price.id === editedPrice.id ? editedPrice : price)));
            setEditedPrice(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Modificar Precios</h1>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <ul className="space-y-2">
                    {prices.map((price) => (
                        <li key={price.id} className="p-2 border border-gray-300 rounded flex justify-between items-center">
                            <span>{`Horas: ${price.hours}, Precio por Hora: $${price.pricePerHour.toFixed(2)}`}</span>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    name="hours"
                                    value={editedPrice?.id === price.id ? editedPrice.hours : ''}
                                    onChange={handleChange}
                                    placeholder="Horas"
                                    className="border p-1 rounded w-20 mr-2"
                                />
                                <input
                                    type="number"
                                    name="price_per_hour"
                                    value={editedPrice?.id === price.id ? editedPrice.pricePerHour : ''}
                                    onChange={handleChange}
                                    placeholder="Precio/Hora"
                                    className="border p-1 rounded w-28 mr-2"
                                />
                                <button
                                    onClick={() => handleEdit(price)}
                                    className="p-1 bg-blue-500 text-white rounded"
                                >
                                    Editar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {editedPrice && (
                    <div className="mt-4 flex justify-end">
                        <button onClick={savePrice} className="p-2 bg-green-500 text-white rounded">
                            Guardar Cambios
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceModificationModal;
