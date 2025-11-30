import React from 'react';
import { useBranch } from '../contexts/BranchContext';

const UsersPage = () => {
  const { branches, currentBranchId, setCurrentBranchId } = useBranch();

  return (
    <div>
      <h1>Users</h1>
      <select onChange={(e) => setCurrentBranchId(e.target.value)} value={currentBranchId}>
        {branches.map(branch => (
          <option key={branch.id} value={branch.id}>{branch.name}</option>
        ))}
      </select>
      {/* Render users based on currentBranchId */}
    </div>
  );
};

export default UsersPage;