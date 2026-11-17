import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

export const createProduct = async (sellerId, productData) => {
  const product = await Product.create({
    ...productData,
    sellerId
  });
  return product;
};

export const getProducts = async ({
  category,
  exchangeType,
  longitude,
  latitude,
  radiusKm = 5,
  status = 'AVAILABLE',
  search,
  page = 1,
  limit = 20
}) => {
  const query = {};

  if (status) query.availabilityStatus = status;
  if (category) query.categoryId = category;
  if (exchangeType) query.exchangeType = exchangeType;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Geospatial search: 2dsphere $geoWithin centerSphere
  // Earth radius in kilometers ~ 6378.1 km
  if (longitude !== undefined && latitude !== undefined && !isNaN(Number(longitude)) && !isNaN(Number(latitude))) {
    const validRadiusKm = Math.min(Math.max(Number(radiusKm) || 5, 1), 25);
    const radiusInRadians = validRadiusKm / 6378.1;
    query.location = {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(longitude), parseFloat(latitude)], // [lon, lat]
          radiusInRadians
        ]
      }
    };
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .populate('sellerId', 'name profile.gardenName profile.avatar isEmailVerified')
    .populate('categoryId', 'name slug icon')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(query);

  // Strip exact private coordinates for public discovery
  const safeProducts = products.map((p) => {
    if (p.location && p.location.isExactLocationHidden) {
      p.location.approximateCoords = [
        Math.round(p.location.coordinates[0] * 100) / 100,
        Math.round(p.location.coordinates[1] * 100) / 100
      ];
      p.location.coordinates = p.location.approximateCoords;
    }
    return p;
  });

  return {
    products: safeProducts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate('sellerId', 'name profile.gardenName profile.avatar profile.bio')
    .populate('categoryId', 'name slug icon');

  if (!product) {
    throw new ApiError(404, 'Product listing not found.');
  }

  // Increment view count
  product.viewsCount += 1;
  await product.save();

  return product;
};
