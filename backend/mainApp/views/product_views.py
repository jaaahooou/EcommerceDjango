from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from rest_framework.response import Response
from mainApp.models import Product,Review
from mainApp.serializers import ProductSerializer, User,UserSerializer, UserSerializerWithToken
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger




@api_view(['GET'])
def getProducts(request):
    query=request.query_params.get('keyword')
   
    if query == None:
        query=''
    products= Product.objects.filter(name__icontains=query)
    page = request.query_params.get('page')
    paginator = Paginator(products, 2)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except:
        products = paginator.page(paginator.num_pages)
    
    if page == None:
        page = 1
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products':serializer.data,'page':page, 'pages':paginator.num_pages})




@api_view(['GET'])
def getProduct(request,pk):
    
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    
    user=request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price =0,
        brand='Sample brand',
        countInStock = 0,
        category='Sample Cat',
        description='Sample desc'
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data = request.data
    product = Product.objects.get(_id=pk)
    product.name=data['name']
    product.price=data['price']
    product.brand=data['brand']
    product.countInStock=data['countInStock']
    product.category=data['category']
    product.description=data['description']

    product.save()
    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product = Product.objects.get(_id=pk)
    product.delete()
  
    return Response('Product deleted')


@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request):
    data= request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request,pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data 

    # - If review already exist

    alreadyExist = product.review_set.filter(user=user).exists()
    if alreadyExist:
        content = {'Detail':'Product already reviewed'}
        return Response(content, status = status.HTTP_400_BAD_REQUEST)

    # - If there is no rating or 0

    elif data['rating'] == 0:
        content = {'Detail':'Plesae select a rating'}
        return Response(content, status = status.HTTP_400_BAD_REQUEST)

    # - Everything s ok, craeate review

    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating 
        
        product.rating = total / len(reviews)
        product.save()

        return Response({'Detail':'Review Added'})

