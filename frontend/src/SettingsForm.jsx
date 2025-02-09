import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Input, InputLabel } from '@mui/material';

function SettingsForm({ onUpdate }) {
    const [companyName, setCompanyName] = useState('');
    const [companyNameColor, setCompanyNameColor] = useState('#000000');
    const [logo, setLogo] = useState(null);
    const [headerColor, setHeaderColor] = useState('#ffffff');
    const [footerText, setFooterText] = useState('');
    const [footerTextColor, setFooterTextColor] = useState('#000000');
    const [footerColor, setFooterColor] = useState('#ffffff');
    const [activeNavIndexColor, setActiveNavIndexColor] = useState('#000000');

    useEffect(() => {
        axios.get('http://localhost:5000/api/settings')
            .then(response => {
                const {
                    company_name, company_name_color, header_color,
                    footer_text, footer_text_color, footer_color,
                    active_nav_index_color
                } = response.data;

                setCompanyName(company_name || '');
                setCompanyNameColor(company_name_color || '#000000');
                setHeaderColor(header_color || '#ffffff');
                setFooterText(footer_text || '');
                setFooterTextColor(footer_text_color || '#000000');
                setFooterColor(footer_color || '#ffffff');
                setActiveNavIndexColor(active_nav_index_color || '#000000');
            })
            .catch(error => console.error('Error fetching settings:', error));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('company_name', companyName || '');
        formData.append('company_name_color', companyNameColor || '#000000');
        formData.append('logo', logo);
        formData.append('header_color', headerColor || '#ffffff');
        formData.append('footer_text', footerText || '');
        formData.append('footer_text_color', footerTextColor || '#000000');
        formData.append('footer_color', footerColor || '#ffffff');
        formData.append('active_nav_index_color', activeNavIndexColor || '#000000');

        try {
            await axios.post('http://localhost:5000/api/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            onUpdate();
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
            {/* First Column */}
            <div style={styles.column}>
                <InputLabel htmlFor="companyName">Company Name</InputLabel>
                <TextField
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ color: companyNameColor }}
                />

                <InputLabel htmlFor="companyNameColor">Company Name Color</InputLabel>
                <Input
                    id="companyNameColor"
                    type="color"
                    value={companyNameColor}
                    onChange={(e) => setCompanyNameColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <InputLabel htmlFor="logo">Logo</InputLabel>
                <Input
                    id="logo"
                    type="file"
                    onChange={(e) => setLogo(e.target.files[0])}
                    fullWidth
                    margin="normal"
                />

                <InputLabel htmlFor="headerColor">Header Color</InputLabel>
                <Input
                    id="headerColor"
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                {/* Save Button at Bottom of First Column */}
                <Button type="submit" variant="contained" color="error" style={styles.saveButton}>
                    Save Settings
                </Button>
            </div>

            {/* Second Column */}
            <div style={styles.column}>
                <InputLabel htmlFor="footerText">Footer Text</InputLabel>
                <TextField
                    id="footerText"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ color: footerTextColor }}
                />

                <InputLabel htmlFor="footerTextColor">Footer Text Color</InputLabel>
                <Input
                    id="footerTextColor"
                    type="color"
                    value={footerTextColor}
                    onChange={(e) => setFooterTextColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <InputLabel htmlFor="footerColor">Footer Color</InputLabel>
                <Input
                    id="footerColor"
                    type="color"
                    value={footerColor}
                    onChange={(e) => setFooterColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <InputLabel htmlFor="activeNavIndexColor">Active Navigation Index Color</InputLabel>
                <Input
                    id="activeNavIndexColor"
                    type="color"
                    value={activeNavIndexColor}
                    onChange={(e) => setActiveNavIndexColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
        </form>
    );
}

// Styles for Layout
const styles = {
    formContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    saveButton: {
        marginTop: '20px',
    },
};

export default SettingsForm;
