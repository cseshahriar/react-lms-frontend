import React, { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [visiblePages, setVisiblePages] = useState([]);

  useEffect(() => {
    // Calculate visible page numbers (max 5 shown at a time)
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    setVisiblePages(pages);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="d-flex justify-content-center mt-5" aria-label="Course pagination">
      <ul className="pagination">
        {/* Previous Page Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </button>
        </li>

        {/* First Page Button (if not in visible range) */}
        {visiblePages[0] > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {visiblePages[0] > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          </>
        )}

        {/* Visible Page Numbers */}
        {visiblePages.map(page => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Last Page Button (if not in visible range) */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <li className="page-item disabled"><span className="page-link">...</span></li>
            )}
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* Next Page Button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
            <span className="sr-only">Next</span>
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;