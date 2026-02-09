import { useState, useEffect } from "react";
import Layout from "../Shared/Layout/Layout";
import api from "../services/api";
import {
  Users,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  X,
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users"); // You'll need to create this endpoint
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      filterRole === "ALL" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-amber-900 mb-4" size={32} />
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold">
            Loading Users...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-amber-800" size={32} />
            <h1 className="text-4xl md:text-5xl font-display text-black uppercase tracking-tighter">
              User Management
            </h1>
          </div>
          <p className="text-neutral-500 text-sm uppercase tracking-widest">
            View all registered users and administrators
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-50 p-6 border border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
                Total Users
              </span>
              <Users size={18} className="text-amber-800" />
            </div>
            <p className="text-3xl font-display font-bold text-black">
              {users.length}
            </p>
          </div>

          <div className="bg-neutral-50 p-6 border border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
                Customers
              </span>
              <User size={18} className="text-amber-800" />
            </div>
            <p className="text-3xl font-display font-bold text-black">
              {users.filter((u) => u.role === "CUSTOMER").length}
            </p>
          </div>

          <div className="bg-neutral-50 p-6 border border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
                Admins
              </span>
              <ShieldCheck size={18} className="text-amber-800" />
            </div>
            <p className="text-3xl font-display font-bold text-black">
              {users.filter((u) => u.role === "ADMIN").length}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 pb-6 border-b border-neutral-100">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-neutral-200 text-sm focus:outline-none focus:border-amber-800 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex gap-4 items-center">
            <Filter size={16} className="text-amber-800" />
            <div className="flex gap-2">
              {["ALL", "CUSTOMER", "ADMIN"].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${
                    filterRole === role
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-black hover:bg-neutral-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
            {filteredUsers.length} {filteredUsers.length === 1 ? "User" : "Users"} Found
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 mb-6">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
            <Users size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              No users found matching your criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full hidden md:table">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black">
                    User
                  </th>
                  <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black">
                    Role
                  </th>
                  <th className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <User size={18} className="text-amber-800" />
                        </div>
                        <span className="font-medium text-sm text-black">
                          {user.name || "No Name"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-neutral-600 text-sm">
                        <Mail size={14} className="text-neutral-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-[9px] uppercase tracking-widest font-bold ${
                          user.role === "ADMIN"
                            ? "bg-amber-800 text-white"
                            : "bg-neutral-200 text-black"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-neutral-600 text-sm">
                        <Calendar size={14} className="text-neutral-400" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-neutral-200 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-amber-800" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-black">
                          {user.name || "No Name"}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-[8px] uppercase tracking-widest font-bold mt-1 ${
                            user.role === "ADMIN"
                              ? "bg-amber-800 text-white"
                              : "bg-neutral-200 text-black"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-neutral-600 text-xs">
                      <Mail size={12} className="text-neutral-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 text-xs">
                      <Calendar size={12} className="text-neutral-400" />
                      Joined {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;