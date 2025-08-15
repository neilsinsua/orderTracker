import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from .models import Customer, Product


class CustomerType(DjangoObjectType):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = '__all__'

class Query(graphene.ObjectType):
    customers = graphene.List(
        CustomerType,
        q=graphene.String(required=False),
        limit=graphene.Int(required=False)
    )
    customer = graphene.Field(CustomerType, id=graphene.Int())
    products = graphene.List(
        ProductType,
        q=graphene.String(required=False),
        limit=graphene.Int(required=False)
    )
    product = graphene.Field(ProductType, id=graphene.Int())

    def resolve_customers(self, info , q=None, limit=None):
        qs = Customer.objects.all()
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(email__icontains=q)).distinct()
        if limit:
            return qs[:limit]
        return qs

    def resolve_customer(self, info, id=None):
        if id is None:
            return None
        return Customer.objects.filter(pk=id).first()

    def resolve_products(self, info , q=None, limit=None):
        qs = Product.objects.all()
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(sku__icontains=q)).distinct()
        if limit:
            return qs[:limit]
        return qs

    def resolve_product(self, info, id=None):
        if id is None:
            return None
        return Product.objects.filter(pk=id).first()

schema = graphene.Schema(query=Query)