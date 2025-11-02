import React from 'react';
import { useParams } from 'react-router-dom';

const ClassDetailPage = () => {
  const { id } = useParams();

  // TODO: Fetch class data from API using the id

  return (
    <div>
      <h1>Trang Chi Tiết Lớp Học</h1>
      <p>ID của lớp học: <strong>{id}</strong></p>
      {/* Hiển thị thông tin chi tiết của lớp học ở đây */}
    </div>
  );
};

export default ClassDetailPage;
