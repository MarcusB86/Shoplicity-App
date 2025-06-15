const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

class Product {
    static async create({ userId, title, description, price, imageUrl, category, condition }) {
        try {
            console.log('Creating product with data:', { userId, title, description, price, imageUrl, category, condition }); // Debug log
            
            const query = `
                INSERT INTO products (seller_id, title, description, price, image_url, category, condition)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const values = [userId, title, description, price, imageUrl, category, condition];
            console.log('Query values:', values); // Debug log
            
            const { rows } = await pool.query(query, values);
            console.log('Created product:', rows[0]); // Debug log
            return rows[0];
        } catch (error) {
            console.error('Error in Product.create:', error); // Debug log
            throw error;
        }
    }

    static async findAll() {
        const query = `
            SELECT p.*, u.email as seller_email
            FROM products p
            JOIN users u ON p.seller_id = u.id
            ORDER BY p.created_at DESC
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    static async findByUserId(userId) {
        const query = `
            SELECT * FROM products
            WHERE seller_id = $1
            ORDER BY created_at DESC
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT p.*, u.email as seller_email
            FROM products p
            JOIN users u ON p.seller_id = u.id
            WHERE p.id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    static async update(id, { title, description, price, imageUrl, category, condition }) {
        const query = `
            UPDATE products
            SET title = $1,
                description = $2,
                price = $3,
                image_url = $4,
                category = $5,
                condition = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `;
        const values = [title, description, price, imageUrl, category, condition, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = Product; 