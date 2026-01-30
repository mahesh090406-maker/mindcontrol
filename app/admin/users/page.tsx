"use client";

import { useState } from "react";
import { Search, Plus, Filter, Download } from "lucide-react";
import UserTable from "@/components/admin/UserTable";
import AddUserModal from "@/components/admin/AddUserModal";

export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([
        { id: "1", name: "Sarah Miller", email: "sarah.m@example.com", role: "User", status: "Active", joined: "Jan 12, 2026" },
        { id: "2", name: "David Chen", email: "d.chen88@example.com", role: "Admin", status: "Active", joined: "Dec 05, 2025" },
        { id: "3", name: "Jessica Wong", email: "jwong@design.co", role: "User", status: "Inactive", joined: "Nov 20, 2025" },
        { id: "4", name: "Michael Ross", email: "mike.ross@law.com", role: "User", status: "Active", joined: "Jan 28, 2026" },
        { id: "5", name: "Alex Johnson", email: "alex.j@tech.io", role: "Moderator", status: "Suspended", joined: "Oct 15, 2025" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    // Filter Users
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = (userData: any) => {
        if (editingUser) {
            // Update existing
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
            setEditingUser(null);
        } else {
            // Add new
            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                ...userData
            };
            setUsers([newUser, ...users]);
        }
    };

    const handleDeleteUser = (id: string) => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">User Management</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage system access and user accounts.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button
                        onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2"
                    >
                        <Plus size={18} /> Add User
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by name or email..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-4 rounded-xl border border-slate-700 flex items-center gap-2 transition-colors">
                    <Filter size={18} /> <span className="hidden md:inline">Filter</span>
                </button>
            </div>

            <UserTable
                users={filteredUsers}
                onEdit={openEditModal}
                onDelete={handleDeleteUser}
            />

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddUser}
                editingUser={editingUser}
            />
        </div>
    );
}
