"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, DollarSign, User, Calendar, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import LeadFormModal from '@/components/LeadFormModal';
import { useAuth } from '@/context/AuthContext';

export default function LeadDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  const fetchLeadDetails = async () => {
    try {
      const [leadRes, notesRes] = await Promise.all([
        api.get(`/leads/${id}`),
        api.get(`/leads/${id}/notes`)
      ]);
      setLead(leadRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error('Failed to fetch lead details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLeadDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await api.delete(`/leads/${id}`);
        router.push('/leads');
      } catch (error) {
        console.error('Failed to delete lead', error);
      }
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setNoteLoading(true);
    try {
      await api.post(`/leads/${id}/notes`, { 
        content: newNote,
        createdBy: user?.email || 'Unknown' 
      });
      setNewNote('');
      // Refresh notes
      const notesRes = await api.get(`/leads/${id}/notes`);
      setNotes(notesRes.data);
    } catch (error) {
      console.error('Failed to add note', error);
    } finally {
      setNoteLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-indigo-100 text-indigo-800';
      case 'Qualified': return 'bg-yellow-100 text-yellow-800';
      case 'Proposal Sent': return 'bg-purple-100 text-purple-800';
      case 'Won': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!lead) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Lead not found</h2>
          <Link href="/leads" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Leads
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/leads" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <span className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Edit className="h-4 w-4 mr-2 text-gray-500" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Lead Information</h3>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.email || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-2" /> Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.phoneNumber || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Building className="h-4 w-4 mr-2" /> Company
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.companyName || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" /> Estimated Value
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">${lead.estimatedDealValue.toLocaleString()}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-2" /> Assigned To
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.assignedSalesperson || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" /> Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Lead Source</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.leadSource || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">Internal Notes</h3>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-4 max-h-[500px]">
              {notes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No notes yet. Add one below.</p>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-gray-700">{note.createdBy}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <form onSubmit={handleAddNote}>
                <div>
                  <label htmlFor="note" className="sr-only">Add a note</label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={noteLoading || !newNote.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {noteLoading ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <LeadFormModal 
          lead={lead}
          onClose={() => setIsEditModalOpen(false)} 
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchLeadDetails(); // Refetch details
          }} 
        />
      )}
    </Layout>
  );
}
