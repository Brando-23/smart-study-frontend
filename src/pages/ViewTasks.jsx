
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';

function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    const confirmDelete = window.confirm('✅ Are you sure you want to mark this task as complete?');
    if (!confirmDelete) return;

    // Optimistically remove task from UI
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

    try {
      await axios.delete(`${import.meta.env.REACT_APP_API_URL}/api/tasks/${id}`);
      console.log('Task deleted successfully:', id);
    } catch (error) {
      alert('⚠️ Failed to delete task from server. Reverting changes.');
      console.error('Error deleting task:', error);
      fetchTasks(); // Re-fetch to restore if needed
    }
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loading}>⏳ Loading your tasks...</div>
      ) : (
        <>
          <h2 style={styles.title}>🗂️ My Task Board</h2>
          <div style={styles.taskGrid}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  id={task._id}
                  task={task.task}
                  description={task.description}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  onComplete={handleComplete}
                />
              ))
            ) : (
              <p style={styles.empty}>✨ No tasks found. Create some to get productive!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 20px',
    background: '#f9f9f9',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#333',
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginTop: '60px',
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    padding: '0 10px',
  },
  empty: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#999',
    marginTop: '30px',
  },
};

export default ViewTasks;

