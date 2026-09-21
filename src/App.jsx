import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import allJobsData from './jobs.json';
import './App.css';
import {
  setSearchTerm,
  setSelectedCompany,
  setSelectedLocation,
  setSortBy,
  toggleBookmark,
  setCurrentPage,
  setActiveTab
} from './store';

export default function App() {
  const dispatch = useDispatch();
  const {
    searchTerm,
    selectedCompany,
    selectedLocation,
    sortBy,
    bookmarks,
    currentPage,
    activeTab
  } = useSelector((state) => state.jobs);

  const companies = [...new Set(allJobsData.map((job) => job.company))];
  const locations = [...new Set(allJobsData.map((job) => job.location))];

  let filteredJobs = allJobsData.filter((job) => {
    if (activeTab === 'bookmarks' && !bookmarks.includes(job.id)) {
      return false;
    }

    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany ? job.company === selectedCompany : true;
    const matchesLocation = selectedLocation ? job.location === selectedLocation : true;

    return matchesSearch && matchesCompany && matchesLocation;
  });

  filteredJobs.sort((a, b) => {
    if (sortBy === 'salaryHigh') return b.salary - a.salary;
    if (sortBy === 'salaryLow') return a.salary - b.salary;
    return new Date(b.date) - new Date(a.date);
  });

  const jobsPerPage = 5;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="container">
      <header className="header">
        <h1>Job Board Feed</h1>
        <div className="nav-tabs">
          <button
            className={activeTab === 'all' ? 'active' : ''}
            onClick={() => dispatch(setActiveTab('all'))}
          >
            All Jobs
          </button>
          <button
            className={activeTab === 'bookmarks' ? 'active' : ''}
            onClick={() => dispatch(setActiveTab('bookmarks'))}
          >
            Bookmarks ({bookmarks.length})
          </button>
        </div>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />

        <select
          value={selectedCompany}
          onChange={(e) => dispatch(setSelectedCompany(e.target.value))}
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => dispatch(setSelectedLocation(e.target.value))}
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
        >
          <option value="date">Sort by: Newest</option>
          <option value="salaryHigh">Salary: High to Low</option>
          <option value="salaryLow">Salary: Low to High</option>
        </select>
      </div>

      <div className="job-list">
        {currentJobs.length === 0 ? (
          <p className="no-jobs">Koi jobs nahi mili.</p>
        ) : (
          currentJobs.map((job) => {
            const isBookmarked = bookmarks.includes(job.id);
            return (
              <div key={job.id} className="job-card">
                <div>
                  <h3>{job.title}</h3>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Salary:</strong> ₹{job.salary.toLocaleString()}</p>
                  <p><strong>Posted:</strong> {job.date}</p>
                </div>
                <button
                  className={`btn-bookmark ${isBookmarked ? 'saved' : ''}`}
                  onClick={() => dispatch(toggleBookmark(job.id))}
                >
                  {isBookmarked ? '★ Saved' : '☆ Bookmark'}
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => dispatch(setCurrentPage(currentPage - 1))}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => dispatch(setCurrentPage(currentPage + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}