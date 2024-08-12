'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateOrder = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState([{ productId: '', size: 0, price: 0 }]);
  const [note, setNote] = useState('');
  const [address, setAddress] = useState({
    street: '',
    village: '',
    district: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUsersAndProducts = async () => {
      try {
        const [usersResponse, productsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}users`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`),
        ]);
        setUsers(usersResponse.data.data);
        setProducts(productsResponse.data.data);
      } catch (error) {
        console.error('Error fetching users or products:', error);
      }
    };

    fetchUsersAndProducts();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: '', size: 0, price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const selectedProduct = products.find(product => product.id === value);
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price;
      }
    }

    setItems(newItems);
  };

  const handleAddressChange = (field, value) => {
    setAddress({
      ...address,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        userId,
        items,
        note,
        ...address
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}orders`, orderData);
      alert('Order created successfully');
      router.push('/admin/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  const getAvailableProducts = (currentProductId) => {
    const selectedProductIds = items.map(item => item.productId);
    return products.filter(product => product.id === currentProductId || !selectedProductIds.includes(product.id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">User:</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="mt-1 block w-full"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Address</h2>
          <label className="block text-gray-700">Street:</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            className="mt-1 block w-full"
          />
          <label className="block text-gray-700">Village:</label>
          <input
            type="text"
            value={address.village}
            onChange={(e) => handleAddressChange('village', e.target.value)}
            className="mt-1 block w-full"
          />
          <label className="block text-gray-700">District:</label>
          <input
            type="text"
            value={address.district}
            onChange={(e) => handleAddressChange('district', e.target.value)}
            className="mt-1 block w-full"
          />
          <label className="block text-gray-700">City:</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            className="mt-1 block w-full"
          />
          <label className="block text-gray-700">Province:</label>
          <input
            type="text"
            value={address.province}
            onChange={(e) => handleAddressChange('province', e.target.value)}
            className="mt-1 block w-full"
          />
          <label className="block text-gray-700">Postal Code:</label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Items</h2>
          {items.map((item, index) => (
            <div key={index} className="mb-2">
              <label className="block text-gray-700">Product:</label>
              <select
                value={item.productId}
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                required
                className="mt-1 block w-full"
              >
                <option value="">Select Product</option>
                {getAvailableProducts(item.productId).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <label className="block text-gray-700">Size:</label>
              <input
                type="number"
                value={item.size}
                onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                className="mt-1 block w-full"
              />
              <label className="block text-gray-700">Price:</label>
              <input
                type="number"
                value={item.price}
                readOnly
                className="mt-1 block w-full"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Item
          </button>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Order
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;