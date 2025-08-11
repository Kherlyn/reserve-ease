import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function UserManagement() {
    const { users, auth } = usePage().props;
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', email: '', role: '' });

    const startEdit = (user) => {
        setEditingUser(user.id);
        setEditForm({
            username: user.username,
            email: user.email,
            role: user.role || '',
        });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ username: '', email: '', role: '' });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const submitEdit = (id) => {
        router.patch(`/admin/users/${id}`, editForm, {
            onFinish: cancelEdit,
        });
    };

    const deleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const promoteUser = (id) => {
        router.post(`/admin/users/${id}/promote`);
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Username</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">{user.id}</td>
                            <td className="border px-4 py-2">
                                {editingUser === user.id ? (
                                    <input
                                        name="username"
                                        value={editForm.username}
                                        onChange={handleEditChange}
                                        className="border px-2 py-1"
                                    />
                                ) : (
                                    user.username
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editingUser === user.id ? (
                                    <input
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        className="border px-2 py-1"
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editingUser === user.id ? (
                                    <select
                                        name="role"
                                        value={editForm.role}
                                        onChange={handleEditChange}
                                        className="border px-2 py-1"
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td className="border px-4 py-2 space-x-2">
                                {editingUser === user.id ? (
                                    <>
                                        <button
                                            onClick={() => submitEdit(user.id)}
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-300 px-2 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(user)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => promoteUser(user.id)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
