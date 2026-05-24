const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initializeAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@codinghub.com' });
        
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2026!';
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            
            const admin = new User({
                email: 'admin@codinghub.com',
                password: hashedPassword,
                name: 'Admin',
                isAdmin: true
            });
            
            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};

module.exports = initializeAdmin;