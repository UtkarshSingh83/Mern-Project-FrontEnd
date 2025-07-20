import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from "../../config/config";
import { Modal } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';

const USER_ROLES = ['viewer', 'developer'];

function ManageUsers() {
    const [errors, setErrors] = useState({});
    const [usersData, setUsersData] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        role: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const handleModalShow = (isEdit, data = {}) => {
        if (isEdit) {
            setFormData({
                id: data._id,
                email: data.email,
                role: data.role,
                name: data.name
            });
        } else {
            setFormData({
                email: '',
                role: '',
                name: ''
            });
        }
        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteModalShow = (userId) => {
        setFormData({
            id: userId
        });
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            setFormLoading(true);
            await axios.delete(
                `${serverEndpoint}/users/${formData.id}`,
                { withCredentials: true });
            setFormData({
                email: '',
                role: '',
                name: ''
            });
            fetchUsers();
        } catch (error) {
            setErrors({ message: 'Something went wrong, please try again' });
        } finally {
            handleDeleteModalClose();
            setFormLoading(false);
        }
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (formData.email.length === 0) {
            newErrors.email = "Email is mandatory";
            isValid = false;
        }

        if (formData.role.length === 0) {
            newErrors.role = "Role is mandatory";
            isValid = false;
        }

        if (formData.name.length === 0) {
            newErrors.name = "Name is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            setFormLoading(true);
            const body = {
                email: formData.email,
                name: formData.name,
                role: formData.role
            };
            const configuration = {
                withCredentials: true
            };
            try {
                if (isEdit) {
                    await axios.put(
                        `${serverEndpoint}/users/${formData.id}`,
                        body, configuration);
                } else {
                    await axios.post(
                        `${serverEndpoint}/users`,
                        body, configuration);
                }

                setFormData({
                    email: '',
                    name: '',
                    role: ''
                });
                fetchUsers();
            } catch (error) {
                setErrors({ message: 'Something went wrong, please try again' });
            } finally {
                handleModalClose();
                setFormLoading(false);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverEndpoint}/users`, {
                withCredentials: true
            });
            setUsersData(response.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch users at the moment, please try again' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'role', headerName: 'Role', flex: 2 },
        {
            field: 'action', headerName: 'Action', flex: 1, renderCell: (params) => (
                <>
                    <IconButton>
                        <EditIcon onClick={() => handleModalShow(true, params.row)} />
                    </IconButton>
                    <IconButton>
                        <DeleteIcon onClick={() => handleDeleteModalShow(params.row._id)} />
                    </IconButton>
                </>
            )
        },
    ];

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12" style={{ maxWidth: 1400, margin: '0 auto' }}>
                    <div
                        className="bg-white rounded-4"
                        style={{ padding: 36, marginTop: 40, boxShadow: '0 6px 32px 0 rgba(44, 62, 80, 0.18), 0 1.5px 6px 0 rgba(44, 62, 80, 0.10)' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                            <h2 className="mb-1" style={{ fontSize: '2rem', fontWeight: 600, color: '#2D3748' }}>
                                Manage Users
                            </h2>
                            <button
                                className="bg-primary text-white px-4 py-2 rounded-md shadow-sm border-0 fw-semibold"
                                style={{ background: '#2B6CB0', transition: 'background 0.2s' }}
                                onMouseOver={e => (e.currentTarget.style.background = '#24548a')}
                                onMouseOut={e => (e.currentTarget.style.background = '#2B6CB0')}
                                onClick={() => handleModalShow(false)}
                            >
                                + Add User
                            </button>
                        </div>

                        {errors.message && (
                            <div className="alert alert-danger my-3" role="alert">
                                {errors.message}
                            </div>
                        )}

                        <div className="table-responsive" style={{ overflowX: 'auto', marginTop: 24 }}>
                            <div style={{ height: 400, width: '100%' }}>
                                <table className="table align-middle mb-0">
                                    <thead>
                                        <tr style={{ background: '#F7FAFC' }}>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3" style={{ color: '#38B2AC', letterSpacing: 1 }}>Email</th>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3" style={{ color: '#38B2AC', letterSpacing: 1 }}>Name</th>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3" style={{ color: '#38B2AC', letterSpacing: 1 }}>Role</th>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3 text-end" style={{ color: '#38B2AC', letterSpacing: 1, minWidth: 120 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersData.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-4">No users found.</td>
                                            </tr>
                                        )}
                                        {usersData.map((row, idx) => (
                                            <tr
                                                key={row._id}
                                                style={{ background: idx % 2 === 0 ? '#fff' : '#F7FAFC', transition: 'background 0.2s' }}
                                                className="table-row"
                                            >
                                                <td className="fw-semibold" style={{ color: '#2D3748' }}>{row.email}</td>
                                                <td style={{ color: '#2D3748' }}>{row.name}</td>
                                                <td style={{ color: '#2D3748' }}>{row.role}</td>
                                                <td className="text-end">
                                                    <Tooltip title="Edit" arrow>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => handleModalShow(true, row)}
                                                                style={{ color: '#718096', transition: 'color 0.2s, background 0.2s', borderRadius: '50%' }}
                                                                onMouseOver={e => (e.currentTarget.style.color = '#2B6CB0')}
                                                                onMouseOut={e => (e.currentTarget.style.color = '#718096')}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Delete" arrow>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => handleDeleteModalShow(row._id)}
                                                                style={{ color: '#718096', transition: 'color 0.2s, background 0.2s', borderRadius: '50%' }}
                                                                onMouseOver={e => (e.currentTarget.style.color = '#E53E3E')}
                                                                onMouseOut={e => (e.currentTarget.style.color = '#718096')}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modals remain unchanged */}
                        <Modal show={showModal} onHide={handleModalClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>{isEdit ? (<>Edit User</>) : (<>Add User</>)}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select name="role" value={formData.role}
                                            onChange={handleChange}
                                            className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                        >
                                            <option key="select" value="">
                                                Select
                                            </option>
                                            {USER_ROLES.map((role) => (
                                                <option key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && (
                                            <div className="invalid-feedback">
                                                {errors.role}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-grid">
                                        {formLoading ? (
                                            <button className="btn btn-primary" type="button" disabled="">
                                                <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                                                <span className="visually-hidden" role="status">
                                                    Loading...
                                                </span>
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        )}

                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>

                        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal()}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this link?
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal()}>
                                    Cancel
                                </button>
                                {formLoading ? (
                                    <button className="btn btn-danger" type="button" disabled="">
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                                        <span className="visually-hidden" role="status">
                                            Loading...
                                        </span>
                                    </button>
                                ) : (
                                    <button className="btn btn-danger" onClick={handleDeleteSubmit}>
                                        Delete
                                    </button>
                                )}

                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;