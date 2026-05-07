"use client";

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  Trophy, 
  XCircle, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const cards = [
    { title: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'New Leads', value: stats?.newLeads || 0, icon: UserPlus, color: 'bg-indigo-500' },
    { title: 'Qualified Leads', value: stats?.qualifiedLeads || 0, icon: CheckCircle, color: 'bg-yellow-500' },
    { title: 'Won Leads', value: stats?.wonLeads || 0, icon: Trophy, color: 'bg-green-500' },
    { title: 'Lost Leads', value: stats?.lostLeads || 0, icon: XCircle, color: 'bg-red-500' },
    { title: 'Pipeline Value', value: formatCurrency(stats?.totalEstimatedValue || 0), icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Won Revenue', value: formatCurrency(stats?.totalValueWon || 0), icon: TrendingUp, color: 'bg-emerald-500' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your lead pipeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 truncate">{card.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
