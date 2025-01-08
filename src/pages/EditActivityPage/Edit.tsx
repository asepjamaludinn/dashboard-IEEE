import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FaTrash } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  photo?: string;
}

const EditActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);

  const getActivitiesFromLocalStorage = (): Activity[] => {
    const storedActivities = localStorage.getItem('activities');
    return storedActivities ? JSON.parse(storedActivities) : [];
  };

  useEffect(() => {
    const activities = getActivitiesFromLocalStorage();
    const activityToEdit = activities.find(
      (activity) => activity.id === Number(id),
    );

    if (activityToEdit) {
      setActivity(activityToEdit);
    } else {
      navigate('/recent-activities');
    }
  }, [id, navigate]);

  const handleSubmit = () => {
    const newErrors: any = {};

    if (!activity?.title) newErrors.title = 'Title is required';
    if (!activity?.description)
      newErrors.description = 'Description is required';
    if (!activity?.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Update activity in localStorage
    const activities = getActivitiesFromLocalStorage();
    const updatedActivities = activities.map((act) =>
      act.id === activity?.id ? activity : act,
    );

    // Simpan updatedActivities ke localStorage
    localStorage.setItem('activities', JSON.stringify(updatedActivities));

    toast.success('Activity updated successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });

    setTimeout(() => {
      navigate('/recent-activities');
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/recent-activities');
  };

  const handleDeletePhoto = () => {
    toast.info('Photo deleted successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });

    if (activity) {
      setActivity({ ...activity, photo: undefined });
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Check if the file type is either PNG or JPEG
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only PNG, JPEG, and JPG images are allowed!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        return;
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;

        // Update the state with the base64 image
        if (activity) {
          setActivity({ ...activity, photo: base64Image });
        }
      };

      // Read the file as a Data URL (base64)
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/jpeg, image/png',
  });

  if (!activity) return null;

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background min-h-screen">
      <div className="mb-6">
        <Breadcrumb pageName="Edit Activity" />
      </div>

      {/* Full Width Card */}
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        {/* Title Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Title
          </h2>
          <input
            type="text"
            placeholder="Enter activity title"
            value={activity.title}
            onChange={(e) =>
              setActivity({ ...activity, title: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:ring-purple-600 transition-all"
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>

        {/* Description Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Description
          </h2>
          <textarea
            placeholder="Enter activity description"
            value={activity.description}
            onChange={(e) =>
              setActivity({ ...activity, description: e.target.value })
            }
            className="w-full p-3 min-h-[120px] border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:ring-purple-600 transition-all resize-none"
          />
          {errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {errors.description}
            </div>
          )}
        </div>

        {/* Date Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Date
          </h2>
          <DatePicker
            selected={activity.date ? new Date(activity.date) : null}
            onChange={(date) =>
              setActivity({
                ...activity,
                date: date ? date.toISOString().split('T')[0] : '',
              })
            }
            className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:ring-purple-600 transition-all"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
          />
          {errors.date && (
            <div className="text-red-500 text-sm mt-1">{errors.date}</div>
          )}
        </div>

        {/* Image Upload Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Upload Image
          </h2>
          <div
            {...getRootProps()}
            className="w-full border-2 border-dashed p-4 rounded-lg text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all border-gray-800 dark:border-gray-600"
          >
            <input {...getInputProps()} />
            <p>Drag & drop a photo here, or click to select one</p>
          </div>
        </div>

        {/* Image Preview Section */}
        {activity.photo && (
          <div className="mt-4 relative">
            <img
              src={activity.photo}
              alt="Preview"
              className="w-full max-h-80 object-cover rounded-lg transition-all"
            />
            <button
              onClick={handleDeletePhoto}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 bg-white rounded-full shadow-md"
            >
              <FaTrash size={24} />
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3"
            style={{
              background: 'linear-gradient(to right, #C0A2FE, #4E2D96)', // Gradient purple
              color: 'white',
              borderRadius: '0.375rem', // Rounded-lg
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Shadow-md
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={
              (e) =>
                (e.currentTarget.style.background =
                  'linear-gradient(to right, #5906BA, #6B0DE3)') // Darker purple on hover
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                'linear-gradient(to right, #C0A2FE, #4E2D96)')
            }
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Activity'}
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ToastContainer for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default EditActivityPage;
