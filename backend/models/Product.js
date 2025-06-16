const { query } = require('../config/database');

class Product {
    static async create({ userId, title, description, price, imageUrl, category, condition }) {
        try {
            console.log('Creating product with data:', { userId, title, description, price, imageUrl, category, condition });
            
            const queryText = `
                INSERT INTO products (seller_id, title, description, price, image_url, category, condition)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const values = [userId, title, description, price, imageUrl, category, condition];
            
            const { rows } = await query(queryText, values);
            console.log('Created product:', rows[0]);
            return rows[0];
        } catch (error) {
            console.error('Error in Product.create:', error);
            throw error;
        }
    }

    static async findAll() {
        const queryText = `
            SELECT p.*, u.email as seller_email
            FROM products p
            JOIN users u ON p.seller_id = u.id
            ORDER BY p.created_at DESC
        `;
        const { rows } = await query(queryText);
        return rows;
    }

    static async findByUserId(userId) {
        const queryText = `
            SELECT * FROM products
            WHERE seller_id = $1
            ORDER BY created_at DESC
        `;
        const { rows } = await query(queryText, [userId]);
        return rows;
    }

    static async findById(id) {
        const queryText = `
            SELECT p.*, u.email as seller_email
            FROM products p
            JOIN users u ON p.seller_id = u.id
            WHERE p.id = $1
        `;
        const { rows } = await query(queryText, [id]);
        return rows[0];
    }

    static async update(id, { title, description, price, imageUrl, category, condition }) {
        const queryText = `
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
        const { rows } = await query(queryText, values);
        return rows[0];
    }

    static async delete(id) {
        const queryText = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const { rows } = await query(queryText, [id]);
        return rows[0];
    }
}

module.exports = Product; 