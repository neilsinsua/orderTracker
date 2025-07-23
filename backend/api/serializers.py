from rest_framework import serializers
from orders.models import Customer, Product, Order, OrderItem

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product_id.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order_id', 'product_id', 'product_name', 'quantity', 'unit_price', 'created_at', 'updated_at']
        read_only_fields = ['product_name', 'created_at', 'updated_at']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer_id.name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'number', 'date_and_time', 'customer_id', 'customer_name', 'shipping_method', 'shipping_cost', 'status', 'items', 'created_at', 'updated_at']
        read_only_fields = ['customer_name', 'items', 'created_at', 'updated_at']
