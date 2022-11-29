const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const Product = require('../models/product.model')

describe('Api de products', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('GET /api/products', () => {

        let response;
        beforeAll(async () => {
            response = await request(app)
                .get('/api/products')
                .send();
        });

        it('debería devolver status 200', () => {
            expect(response.statusCode).toBe(200);
        });

        it('debería devolver la respuesta en formato JSON', () => {
            expect(response.headers['content-type'])
                .toContain('application/json')
        });

        it('debería devolver un array', () => {
            expect(response.body).toBeInstanceOf(Array);
        });

    });





    describe('POST /api/products', () => {




        let response;
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 100, category: 'test', available: true, stock: 10, image: 'url de la imagen' };
        beforeAll(async () => {
            response = await request(app)
                .post('/api/products')
                .send(newProduct);
        });


        afterAll(async () => {
            await Product.deleteMany({ category: 'test' })
        })

        it('debería existir la URL en la aplicación', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('el producto devuelto debería tener _id', () => {
            expect(response.body._id).toBeDefined();
        });

        it('deberia devolver el id del producto', () => {
            expect(response.body.name).toBe(newProduct.name)
        })

    });



    describe('PUT/api/products/PRODUCTSID', () => {
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 100, category: 'test', available: true, stock: 10, image: 'url de la imagen' };
        let productEdit;
        let response;

        beforeAll(async () => {

            productEdit = await Product.create(newProduct);
            response = await request(app)
                .put(`/api/products/${productEdit._id}`)
                .send({ stock: 200, price: 199 });
        });

        // afterAll(async () => {
        //     await Product.findByIdAndDelete(productEdit._id);
        // });

        it('debería existir la URL', () => {
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toContain('application/json');
        })

        it('los datos deberían actualizarse', () => {
            expect(response.body.stock).toBe(200);
            expect(response.body.price).toBe(199);
        })
    })



    describe('DELETE /api/products/PRODUCTOID', () => {
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 100, category: 'test', available: true, stock: 10, image: 'url de la imagen' };
        let productToDelete;
        let response

        beforeAll(async () => {
            productToDelete = await Product.create(newProduct)

            response = await request(app)
                .delete(`/api/products/${productToDelete._id}`)
                .send();
        })

        afterAll(async () => {
            await Product.findByIdAndDelete(productToDelete._id)
        })

        it('debería existir la url', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        })
        it('el producto deberia borrarse de la BD', async () => {
            const p = await Product.findById(productToDelete._id)
            expect(p).toBeNull();
        })

    })


});