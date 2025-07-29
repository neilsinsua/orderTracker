
from django.contrib import admin
from django.urls import path, include
from .views import CustomerViewSet, ProductViewSet, OrderViewSet, OrderItemViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]
