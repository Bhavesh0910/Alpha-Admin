import React, { useState } from 'react';
import { Input, Tag, Button, List } from 'antd';
import './Permissions.scss';
import warningIcon from '../../assets/icons/warning.svg'
import plusIcon from '../../assets/icons/plus.svg'
import tickIcon from '../../assets/icons/tick.svg'
import searchIcon from "../../assets/icons/searchIcon.svg";

const permissionsList = [
    "Support | Stage 1 | Can create Account",
    "Coupons | Can take Actions"
];

function Permissions() {
    const [name, setName] = useState('');
    const [tags, setTags] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && name) {
            setTags([...tags, name]);
            setName('');
        }
    };

    const handleCloseTag = (tag) => {
        const newTags = tags.filter((t) => t !== tag);
        setTags(newTags);
    };

    const handleSelectPermission = (permission) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };

    const filteredPermissions = permissionsList.filter((permission) =>
        permission.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleRemoveGrantedPermission = (permission) => {
        const newGrantedPermissions = selectedPermissions.filter((p) => p !== permission);
        setSelectedPermissions(newGrantedPermissions);
    };

    const handleSave = () => {
        // Implement your save logic here
        console.log('Permissions saved:', selectedPermissions);
        setModalVisible(false); // Close the modal after saving
    };

    return (
        <div className='permissions'>
            <h2 className='page_header'>Permissions</h2>

            <div className='input_wrapper'>
                <label className='title'>Name</label>
                <Input
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ marginBottom: '10px' }}
                />
            </div>

            <div>
                {tags.map((tag) => (
                    <Tag
                        key={tag}
                        closable
                        onClose={() => handleCloseTag(tag)}
                        style={{ margin: '5px' }}
                    >
                        {tag}
                    </Tag>
                ))}
            </div>

            <div className='permissions_wrapper'>
                <div className='available_permissions'>
                    <div className='header available_header'>
                        <h2>Available Permissions</h2>
                    </div>

                    <div className='input'>
                        <div className="search_box_wrapper_2">
                            <Input
                                placeholder='Search permissions'
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            />
                            <div className="searchImg"
                            >
                                <img src={searchIcon} alt="searchIcon" />
                            </div>
                        </div>
                    </div>

                    <List
                        bordered
                        dataSource={filteredPermissions}
                        renderItem={(permission) => (
                            <List.Item
                                style={{
                                    borderBottom: '1px solid var(--Brand-1, #D2D2D2)',
                                    background: 'var(--new-body, #F5F5F5)',
                                    display: 'flex',
                                    padding: '0',
                                    height: '38px',
                                    alignItems: 'center',
                                }}
                                actions={[
                                    <span
                                        type={selectedPermissions.includes(permission) ? 'primary' : 'default'}
                                        onClick={() => handleSelectPermission(permission)}

                                    >
                                        <img src={selectedPermissions.includes(permission) ? tickIcon : plusIcon} alt="" style={{ width: '16px', height: '16px' }} />
                                    </span>,
                                ]}
                            >
                                <span style={{ flexGrow: 1, padding: '10px 20px' }}>{permission}</span>
                            </List.Item>
                        )}
                    />
                </div>

                <div className='granted_permission'>
                    <div className='header granted_header'>
                        <h2>Granted Permissions</h2>
                    </div>

                    <div className='input'>
                        <div className="search_box_wrapper_2">
                            <Input
                                placeholder='Granted Permissions'
                                style={{ marginBottom: '5px' }}
                            />
                        <div className="searchImg"
                        >
                            <img src={searchIcon} alt="searchIcon" />
                        </div>
                        </div>
                    </div>
                    <div className='granted_permissions_list'>
                        {selectedPermissions.map((permission) => {
                            const [page, stage, action] = permission.split(" | ");
                            return (
                                <div className='granted' key={permission} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                                    <span>{page} | {stage} : </span>
                                    <Tag
                                        key={action}
                                        closable
                                        onClose={() => handleRemoveGrantedPermission(permission)}
                                        style={{ marginLeft: '5px' }}
                                    >
                                        {action}
                                    </Tag>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className='btns btns_wrapper_one'>
                <button onClick={() => setModalVisible(true)}>Add All</button>
                <button>Remove All</button>
            </div>

            <div className='btns btns_wrapper_two'>
                <button>Cancel</button>
                <button className='save_btn' onClick={() => setModalVisible(true)}>Save</button>
            </div>

            {modalVisible && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <img src={warningIcon} alt='' />
                        <h3>Warning! </h3>
                        <p>Removing " Trader | User List | View " will also result
                            in the removal of " Trader | User List | Edit ".</p>
                        <div className="modal-actions">
                            <button className="btn" onClick={() => setModalVisible(false)}>OK</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

export default Permissions;
