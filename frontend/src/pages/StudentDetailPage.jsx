import React from 'react';
import { useParams } from 'react-router-dom';

const StudentDetailPage = () => {
  const { id } = useParams();

  // TODO: Fetch student data from API using the id

  return (
    <div>
      <h1>Trang Chi Tiết Học Sinh</h1>
      <p>ID của học sinh: <strong>{id}</strong></p>
      {/* Hiển thị thông tin chi tiết của học sinh ở đây */}
    </div>
  );
};

export default StudentDetailPage;
