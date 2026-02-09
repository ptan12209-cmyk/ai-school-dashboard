import React from 'react';
import { useParams } from 'react-router-dom';

const TeacherDetailPage = () => {
  const { id } = useParams();

  // TODO: Fetch teacher data from API using the id

  return (
    <div>
      <h1>Trang Chi Tiết Giáo Viên</h1>
      <p>ID của giáo viên: <strong>{id}</strong></p>
      {/* Hiển thị thông tin chi tiết của giáo viên ở đây */}
    </div>
  );
};

export default TeacherDetailPage;
