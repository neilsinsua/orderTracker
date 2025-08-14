from django.urls import path, include, reverse
from rest_framework.test import APITestCase
from rest_framework import status
from orders.models import Customer, Product, Order, OrderItem

class CustomerAPITest(APITestCase):
    def setUp(self):
        self.list_url = reverse('customer-list')
        self.cust = Customer.objects.create(name="Zoe", email="zoe@example.com")
        self.detail_url = reverse('customer-detail', args=[self.cust.id])

    def test_list_customers(self):
        resp = self.client.get(self.list_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 1)

    def test_retrieve_customer(self):
        resp = self.client.get(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['email'], 'zoe@example.com')

    def test_create_customer_valid(self):
        data = {'name': 'Anna', 'email': 'anna@example.com'}
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_create_customer_invalid(self):
        data = {'name': 'fail', 'email': 'not-an-email'}
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', resp.data)

    def test_update_customer_put(self):
        data = {'name': 'Zoe New', 'email': 'zoe.new@example.com'}
        resp = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['name'], 'Zoe New')

    def test_partial_update_customer_patch(self):
        data = {'name': 'Zoe Patched'}
        resp = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['name'], 'Zoe Patched')

    def test_delete_customer(self):
        resp = self.client.delete(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Customer.objects.filter(id=self.cust.id).exists())

class ProductAPITest(APITestCase):
    def setUp(self):
        self.list_url = reverse('product-list')
        self.prod = Product.objects.create(sku="SKU123", name="Test Product", unit_price=19.99)
        self.detail_url = reverse('product-detail', args=[self.prod.id])

    def test_list_products(self):
        resp = self.client.get(self.list_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 1)

    def test_retrieve_product(self):
        resp = self.client.get(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['name'], 'Test Product')

    def test_create_product_valid(self):
        data = {'sku': 'SKU456', 'name': 'New Product', 'unit_price': 29.99}
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_create_product_invalid(self):
        data = {'sku': '', 'name': 'Invalid Product', 'unit_price': -10}
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('sku', resp.data)

    def test_update_product_put(self):
        data = {'sku': 'SKU1234', 'name': 'Updated Product', 'unit_price': 25.00}
        resp = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['name'], 'Updated Product')

    def test_partial_update_product_patch(self):
        data = {'name': 'Partially Updated Product'}
        resp = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['name'], 'Partially Updated Product')

    def test_delete_product(self):
        resp = self.client.delete(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.prod.id).exists())

class OrderAPITest(APITestCase):
    def setUp(self):
        self.list_url = reverse('order-list')
        self.cust = Customer.objects.create(name="Zoe", email="zoe@example.com")
        self.order = Order.objects.create(
            number="ORD123",
            customer_id=self.cust.id,
            shipping_method="express",
            shipping_cost=5.00,
            status="pending"
        )
        self.detail_url = reverse('order-detail', args=[self.order.id])

    def test_list_orders(self):
        resp = self.client.get(self.list_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 1)
    
    def test_retrieve_order(self):
        resp = self.client.get(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['number'], 'ORD123')
    
    def test_create_order_valid(self):
        data = {
            'number': 'ORD456',
            'customer': self.cust.id,
            'shipping_method': 'standard',
            'shipping_cost': 10.00,
            'status': 'pending'
        }
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['number'], 'ORD456')

    def test_create_order_invalid(self):
        data = {
            'number': '',
            'customer_id': self.cust.id,
            'shipping_method': 'invalid_method',
            'shipping_cost': -5.00,
            'status': 'unknown'
        }
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('number', resp.data)
    
    def test_update_order_put(self):
        data = {
            'number': 'ORD1234',
            'customer_id': self.cust.id,
            'shipping_method': 'express',
            'shipping_cost': 7.50,
            'status': 'cancelled'
        }
        resp = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['shipping_method'], 'express')
    
    def test_partial_update_order_patch(self):
        data = {'status': 'completed'}
        resp = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'completed')
    
    def test_delete_order(self):
        resp = self.client.delete(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Order.objects.filter(id=self.order.id).exists())


class OrderItemAPITest(APITestCase):
    def setUp(self):
        self.cust = Customer.objects.create(name="Zoe", email="zoe@example.com")
        self.prod = Product.objects.create(sku="SKU123", name="Test Product", unit_price=19.99)
        self.order = Order.objects.create(
            number="ORD123",
            customer_id=self.cust.id,
            shipping_method="express",
            shipping_cost=5.00,
            status="pending"
        )
        self.list_url = reverse('orderitem-list')
        self.order_item = OrderItem.objects.create(
            order_id=self.order.id,
            product_id=self.prod.id,
            quantity=2,
            unit_price=19.99
        )
        self.detail_url = reverse('orderitem-detail', args=[self.order_item.id])

    def test_list_order_items(self):
        resp = self.client.get(self.list_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 1)

    def test_retrieve_order_item(self):
        resp = self.client.get(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['product_id'], self.prod.id)
    
    def test_create_order_item_valid(self):
        data = {
            'order_id': self.order.id,
            'product_id': self.prod.id,
            'quantity': 3,
            'unit_price': 19.99
        }
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['quantity'], 3)

    def test_create_order_item_invalid(self):
        data = {
            'order_id': 'fail',
            'product_id': self.prod.id,
            'quantity': -1,
            'unit_price': 19.99
        }
        resp = self.client.post(self.list_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('quantity', resp.data)
    
    def test_update_order_item_put(self):
        data = {
            'order_id': self.order.id,
            'product_id': self.prod.id,
            'quantity': 5,
            'unit_price': 19.99
        }
        resp = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['quantity'], 5)
    
    def test_partial_update_order_item_patch(self):
        data = {'quantity': 4}
        resp = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['quantity'], 4)
    
    def test_delete_order_item(self):
        resp = self.client.delete(self.detail_url, format='json')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(OrderItem.objects.filter(id=self.order_item.id).exists())
    
    