const sequelize = require('./config/database');
const User = require('./models/User');

async function testRegistration() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync(); // Ensure tables
        console.log('Tables synced.');

        const newUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        console.log('Attempting to create user:', newUser.email);
        const user = await User.create(newUser);
        console.log('User created successfully:', user.toJSON());

    } catch (error) {
        console.error('Registration failed:', error);
        if (error.errors) {
            error.errors.forEach(e => console.error(`Validation error: ${e.message}`));
        }
    } finally {
        await sequelize.close();
    }
}

testRegistration();
