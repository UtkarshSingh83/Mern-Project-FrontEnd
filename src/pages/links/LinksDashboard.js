import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../../config/config';
import { Modal } from 'react-bootstrap';
import { usePermission } from '../../rbac/userPermissions';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

function LinksDashboard() {
    const [errors, setErrors] = useState({});
    const [linksData, setLinksData] = useState([]);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const permission = usePermission();

    const handleShowDeleteModal = (linkId) => {
        setFormData({
            id: linkId
        });
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
                withCredentials: true
            });
            await fetchLinks();
            handleCloseDeleteModal();
        } catch (error) {
            setErrors({ message: 'Unable to delete the link, please try again' });
        }
    };

    const handleOpenModal = (isEdit, data = {}) => {
        if (isEdit) {
            setFormData({
                id: data._id,
                campaignTitle: data.campaignTitle,
                originalUrl: data.originalUrl,
                category: data.category
            });
        }

        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [formData, setFormData] = useState({
        campaignTitle: "",
        originalUrl: "",
        category: ""
    });

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
        if (formData.campaignTitle.length === 0) {
            newErrors.campaignTitle = "Campaign Title is mandatory";
            isValid = false;
        }

        if (formData.originalUrl.length === 0) {
            newErrors.originalUrl = "URL is mandatory";
            isValid = false;
        }

        if (formData.category.length === 0) {
            newErrors.category = "Category is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            const body = {
                campaign_title: formData.campaignTitle,
                original_url: formData.originalUrl,
                category: formData.category
            };
            const configuration = {
                withCredentials: true
            };
            try {
                if (isEdit) {
                    await axios.put(
                        `${serverEndpoint}/links/${formData.id}`,
                        body, configuration);
                } else {
                    await axios.post(
                        `${serverEndpoint}/links`,
                        body, configuration);
                }

                await fetchLinks();
                setFormData({
                    campaignTitle: "",
                    originalUrl: "",
                    category: ""
                });
            } catch (error) {
                setErrors({ message: error.response?.data?.message || 'Unable to add the Link, please try again' });
            } finally {
                handleCloseModal();
            }
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/links`, {
                withCredentials: true
            });
            setLinksData(response.data.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch links at the moment. Please try again' });
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const columns = [
        { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
        {
            field: 'originalUrl', headerName: 'URL', flex: 3, renderCell: (params) => (
                <>
                    <a href={`${serverEndpoint}/links/r/${params.row._id}`}
                        target='_blank'
                        rel="noopener noreferrer"
                    >
                        {params.row.originalUrl}
                    </a>
                </>
            )
        },
        { field: 'category', headerName: 'Category', flex: 2 },
        { field: 'clickCount', headerName: 'Clicks', flex: 1 },
        {
            field: 'action', headerName: 'Clicks', flex: 1, renderCell: (params) => (
                <>
                    {permission.canEditLink && (
                        <IconButton>
                            <EditIcon onClick={() => handleOpenModal(true, params.row)} />
                        </IconButton>
                    )}

                    {permission.canDeleteLink && (
                        <IconButton>
                            <DeleteIcon onClick={() => handleShowDeleteModal(params.row._id)} />
                        </IconButton>
                    )}

                    {permission.canViewLink && (
                        <IconButton>
                            <AssessmentIcon onClick={() => {
                                navigate(`/analytics/${params.row._id}`);
                            }} />
                        </IconButton>
                    )}
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
                            <div>
                                <h2 className="mb-1" style={{ fontSize: '2rem', fontWeight: 600, color: '#2D3748' }}>
                                    Manage Affiliate Links
                                </h2>
                                <div className="text-muted" style={{ fontSize: '1rem' }}>
                                    View, add, and manage all your affiliate links in one place.
                                </div>
                            </div>
                            {permission.canCreateLink && (
                                <button
                                    className="bg-primary text-white px-4 py-2 rounded-md shadow-sm border-0 fw-semibold"
                                    style={{ background: '#2B6CB0', transition: 'background 0.2s' }}
                                    onMouseOver={e => (e.currentTarget.style.background = '#24548a')}
                                    onMouseOut={e => (e.currentTarget.style.background = '#2B6CB0')}
                                    onClick={() => handleOpenModal(false)}
                                >
                                    + Add Link
                                </button>
                            )}
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
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3" style={{ color: '#718096', letterSpacing: 1 }}>Campaign</th>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3" style={{ color: '#718096', letterSpacing: 1 }}>URL</th>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3" style={{ color: '#718096', letterSpacing: 1 }}>Category</th>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3" style={{ color: '#718096', letterSpacing: 1 }}>Clicks</th>
                                            <th className="text-uppercase text-sm fw-semibold text-secondary py-3 text-end" style={{ color: '#718096', letterSpacing: 1, minWidth: 120 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {linksData.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted py-4">No affiliate links found.</td>
                                            </tr>
                                        )}
                                        {linksData.map((row, idx) => (
                                            <tr
                                                key={row._id}
                                                style={{ background: idx % 2 === 0 ? '#fff' : '#F7FAFC', transition: 'background 0.2s' }}
                                                className="table-row"
                                            >
                                                <td className="fw-semibold" style={{ color: '#2D3748' }}>{row.campaignTitle}</td>
                                                <td>
                                                    <a
                                                        href={`${serverEndpoint}/links/r/${row._id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-decoration-none"
                                                        style={{ color: '#2B6CB0', wordBreak: 'break-all' }}
                                                        onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                                                        onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                                                    >
                                                        {row.originalUrl}
                                                    </a>
                                                </td>
                                                <td style={{ color: '#2D3748' }}>{row.category}</td>
                                                <td style={{ color: '#2D3748' }}>{row.clickCount}</td>
                                                <td className="text-end">
                                                    {permission.canEditLink && (
                                                        <Tooltip title="Edit" arrow>
                                                            <span>
                                                                <IconButton
                                                                    onClick={() => handleOpenModal(true, row)}
                                                                    style={{ color: '#718096', transition: 'color 0.2s, background 0.2s', borderRadius: '50%' }}
                                                                    onMouseOver={e => (e.currentTarget.style.color = '#2B6CB0')}
                                                                    onMouseOut={e => (e.currentTarget.style.color = '#718096')}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                    {permission.canDeleteLink && (
                                                        <Tooltip title="Delete" arrow>
                                                            <span>
                                                                <IconButton
                                                                    onClick={() => handleShowDeleteModal(row._id)}
                                                                    style={{ color: '#718096', transition: 'color 0.2s, background 0.2s', borderRadius: '50%' }}
                                                                    onMouseOver={e => (e.currentTarget.style.color = '#E53E3E')}
                                                                    onMouseOut={e => (e.currentTarget.style.color = '#718096')}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                    {permission.canViewLink && (
                                                        <Tooltip title="View Analytics" arrow>
                                                            <span>
                                                                <IconButton
                                                                    onClick={() => navigate(`/analytics/${row._id}`)}
                                                                    style={{ color: '#718096', transition: 'color 0.2s, background 0.2s', borderRadius: '50%' }}
                                                                    onMouseOver={e => (e.currentTarget.style.color = '#2B6CB0')}
                                                                    onMouseOut={e => (e.currentTarget.style.color = '#718096')}
                                                                >
                                                                    <AssessmentIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Modal show={showModal} onHide={() => handleCloseModal()}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {isEdit ? (<>Update Link</>) : (<>Add Link</>)}
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="campaignTitle" className="form-label">Campaign Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.campaignTitle ? 'is-invalid' : ''}`}
                                            id="campaignTitle"
                                            name="campaignTitle"
                                            value={formData.campaignTitle}
                                            onChange={handleChange}
                                        />
                                        {errors.campaignTitle && (
                                            <div className="invalid-feedback">
                                                {errors.campaignTitle}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="originalUrl" className="form-label">URL</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.originalUrl ? 'is-invalid' : ''}`}
                                            id="originalUrl"
                                            name="originalUrl"
                                            value={formData.originalUrl}
                                            onChange={handleChange}
                                        />
                                        {errors.originalUrl && (
                                            <div className="invalid-feedback">
                                                {errors.originalUrl}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                        />
                                        {errors.category && (
                                            <div className="invalid-feedback">
                                                {errors.category}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>

                        <Modal show={showDeleteModal} onHide={() => handleCloseDeleteModal()}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Are you sure you want to delete the link?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className='btn btn-secondary'
                                    onClick={() => handleCloseDeleteModal()}
                                >
                                    Cancel
                                </button>
                                <button className='btn btn-danger'
                                    onClick={() => handleDelete()}
                                >
                                    Delete
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LinksDashboard;