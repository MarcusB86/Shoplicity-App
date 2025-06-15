const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

class Cart {
    static async addItem(userId, productId, quantity = 1) {
        const query = `
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + $3
            RETURNING *
        `;
        const values = [userId, productId, quantity];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async removeItem(userId, productId) {
        const query = 'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *';
        const { rows } = await pool.query(query, [userId, productId]);
        return rows[0];
    }

    static async updateQuantity(userId, productId, quantity) {
        const query = `
            UPDATE cart_items
            SET quantity = $3
            WHERE user_id = $1 AND product_id = $2
            RETURNING *
        `;
        const { rows } = await pool.query(query, [userId, productId, quantity]);
        return rows[0];
    }

    static async getCart(userId) {
        const query = `
            SELECT ci.*, p.title, p.price, p.image_url, p.description
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1
            ORDER BY ci.created_at DESC
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }

    static async clearCart(userId) {
        const query = 'DELETE FROM cart_items WHERE user_id = $1 RETURNING *';
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }
}

module.exports = Cart; 