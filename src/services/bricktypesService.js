// services/brickTypeService.js - Complete enhanced version
'use strict';

const db = require('../../models'); 
console.log('Available models:', Object.keys(db));
const BrickType = db.BrickType;
const { Op, Transaction } = require('sequelize');

class BrickTypeService {
  /**
   * Get all brick types with enhanced filtering and pagination
   */
  async getAllBrickTypes(options = {}) {
    const {
      page = 1,
      limit = 10,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      minPrice,
      maxPrice
    } = options;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filter by active status
    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    // Search functionality (case-insensitive)
    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.pricePerBrick = {};
      if (minPrice !== undefined) {
        whereClause.pricePerBrick[Op.gte] = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.pricePerBrick[Op.lte] = maxPrice;
      }
    }

    try {
      const { count, rows } = await BrickType.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        attributes: ['id', 'name', 'pricePerBrick', 'isActive', 'createdAt', 'updatedAt']
      });

      return {
        brickTypes: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < Math.ceil(count / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error in getAllBrickTypes:', error);
      throw new Error('Failed to retrieve brick types from database');
    }
  }

  /**
   * Get only active brick types
   */
  async getActiveBrickTypes() {
    try {
      return await BrickType.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'pricePerBrick', 'isActive', 'createdAt', 'updatedAt']
      });
    } catch (error) {
      console.error('Error in getActiveBrickTypes:', error);
      throw new Error('Failed to retrieve active brick types');
    }
  }

  /**
   * Get brick type by ID
   */
  async getBrickTypeById(id) {
    try {
      const brickType = await BrickType.findByPk(id, {
        attributes: ['id', 'name', 'pricePerBrick', 'isActive', 'createdAt', 'updatedAt']
      });
      return brickType;
    } catch (error) {
      console.error('Error in getBrickTypeById:', error);
      throw new Error('Failed to retrieve brick type by ID');
    }
  }

  /**
   * Create new brick type
   */
async createBrickType(brickTypeData) {
  const transaction = await BrickType.sequelize.transaction(); // ✅ Now this will work

  try {
    const { name, pricePerBrick, isActive = true } = brickTypeData;

    const existingBrickType = await BrickType.findOne({
      where: { name: { [db.Sequelize.Op.like]: name.trim() } },
      transaction
    });

    if (existingBrickType) {
      throw new Error('Brick type with this name already exists');
    }

    const brickType = await BrickType.create({
      name: name.trim(),
      pricePerBrick: parseFloat(pricePerBrick),
      isActive
    }, { transaction });

    await transaction.commit();
    return brickType;
  } catch (error) {
    await transaction.rollback();
    console.error('Error in createBrickType:', error);
    throw error;
  }
}

  /**
   * Update brick type by ID
   */
async updateBrickType(id, updateData) {
    // ... (keep your existing input validation)

    const transaction = await BrickType.sequelize.transaction();
    try {
        // ... (keep your existing setup code)

        if (updateData.name !== undefined) {
            if (typeof updateData.name !== 'string') {
                throw new Error('Name must be a string');
            }
            
            const trimmedName = updateData.name.trim();
            if (trimmedName === '') {
                throw new Error('Name cannot be empty');
            }

            if (trimmedName !== brickType.name) {
                // FIX: Replace Op.iLike with case-insensitive comparison
                const existing = await BrickType.findOne({
                    where: { 
                        [Op.and]: [
                            sequelize.where(
                                sequelize.fn('LOWER', sequelize.col('name')),
                                'LIKE',
                                `%${trimmedName.toLowerCase()}%`
                            ),
                            { id: { [Op.ne]: id } }
                        ]
                    },
                    transaction
                });

                if (existing) {
                    throw new Error('Brick type name already exists');
                }
                cleanUpdateData.name = trimmedName;
            }
        }

        // ... (rest of your existing code)
    } catch (error) {
        // ... (keep your existing error handling)
    }
}
  /**
   * Toggle brick type active status
   */
  async toggleBrickTypeStatus(id) {
    const transaction = await BrickType.sequelize.transaction();
    
    try {
      const brickType = await BrickType.findByPk(id, { transaction });
      
      if (!brickType) {
        await transaction.rollback();
        return null;
      }

      await brickType.update({ isActive: !brickType.isActive }, { transaction });
      await transaction.commit();
      
      return await BrickType.findByPk(id);
    } catch (error) {
      await transaction.rollback();
      console.error('Error in toggleBrickTypeStatus:', error);
      throw error;
    }
  }

  /**
   * Delete brick type by ID
   */
  async deleteBrickType(id) {
    const transaction = await BrickType.sequelize.transaction();
    
    try {
      const brickType = await BrickType.findByPk(id, { transaction });
      
      if (!brickType) {
        await transaction.rollback();
        return false;
      }

      await brickType.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error in deleteBrickType:', error);
      throw error;
    }
  }

  /**
   * Bulk create brick types with transaction
   */
  async bulkCreateBrickTypes(brickTypesData) {
    const transaction = await BrickType.sequelize.transaction();
    const created = [];
    const failed = [];

    try {
      // Validate input
      if (!Array.isArray(brickTypesData) || brickTypesData.length === 0) {
        throw new Error('Invalid input: expected non-empty array');
      }

      for (const brickTypeData of brickTypesData) {
        try {
          // Validate required fields
          if (!brickTypeData.name || brickTypeData.pricePerBrick === undefined) {
            failed.push({
              data: brickTypeData,
              error: 'Name and pricePerBrick are required'
            });
            continue;
          }

          // Check for duplicates (both in existing data and within the current batch)
          const trimmedName = brickTypeData.name.trim();
          
          // Check against existing database records
          const existingBrickType = await BrickType.findOne({
            where: { name: { [Op.iLike]: trimmedName } },
            transaction
          });

          if (existingBrickType) {
            failed.push({
              data: brickTypeData,
              error: 'Brick type with this name already exists in database'
            });
            continue;
          }

          // Check against already created items in this batch
          const duplicateInBatch = created.find(item => 
            item.name.toLowerCase() === trimmedName.toLowerCase()
          );

          if (duplicateInBatch) {
            failed.push({
              data: brickTypeData,
              error: 'Duplicate name found within the batch'
            });
            continue;
          }

          const brickType = await BrickType.create({
            name: trimmedName,
            pricePerBrick: parseFloat(brickTypeData.pricePerBrick),
            isActive: brickTypeData.isActive !== undefined ? brickTypeData.isActive : true
          }, { transaction });

          created.push(brickType);
        } catch (error) {
          failed.push({
            data: brickTypeData,
            error: error.message
          });
        }
      }

      await transaction.commit();
      return { created, failed };
    } catch (error) {
      await transaction.rollback();
      console.error('Error in bulkCreateBrickTypes:', error);
      throw error;
    }
  }

  /**
   * Get price comparison statistics
   */
  async getPriceComparison() {
    try {
      const avgPriceResult = await BrickType.findOne({
        attributes: [
          [BrickType.sequelize.fn('AVG', BrickType.sequelize.col('pricePerBrick')), 'avgPrice']
        ],
        where: { isActive: true }
      });

      const avgPrice = parseFloat(avgPriceResult?.dataValues?.avgPrice || 0);

      const stats = await BrickType.findAll({
        attributes: [
          'id',
          'name',
          'pricePerBrick',
          [BrickType.sequelize.literal(`pricePerBrick - ${avgPrice}`), 'priceVariance'],
          [BrickType.sequelize.literal(`ROUND(((pricePerBrick - ${avgPrice}) / ${avgPrice}) * 100, 2)`), 'percentageVariance']
        ],
        where: { isActive: true },
        order: [['pricePerBrick', 'ASC']]
      });

      return {
        brickTypes: stats,
        averagePrice: avgPrice.toFixed(2),
        statistics: {
          totalActiveBrickTypes: stats.length,
          lowestPrice: stats.length > 0 ? Math.min(...stats.map(s => s.pricePerBrick)) : 0,
          highestPrice: stats.length > 0 ? Math.max(...stats.map(s => s.pricePerBrick)) : 0
        }
      };
    } catch (error) {
      console.error('Error in getPriceComparison:', error);
      throw new Error('Failed to retrieve price comparison data');
    }
  }

  /**
   * Enhanced statistics with more metrics
   */
  async getBrickTypeStats() {
    try {
      const totalCount = await BrickType.count();
      const activeCount = await BrickType.count({ where: { isActive: true } });
      const inactiveCount = totalCount - activeCount;

      const priceStats = await BrickType.findOne({
        attributes: [
          [BrickType.sequelize.fn('AVG', BrickType.sequelize.col('pricePerBrick')), 'avgPrice'],
          [BrickType.sequelize.fn('MIN', BrickType.sequelize.col('pricePerBrick')), 'minPrice'],
          [BrickType.sequelize.fn('MAX', BrickType.sequelize.col('pricePerBrick')), 'maxPrice'],
          [BrickType.sequelize.fn('COUNT', BrickType.sequelize.col('id')), 'totalCount']
        ],
        where: { isActive: true }
      });

      const recentlyAdded = await BrickType.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      });

      const recentlyUpdated = await BrickType.count({
        where: {
          updatedAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          },
          createdAt: {
            [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Exclude recently created
          }
        }
      });

      // Get price distribution (categorize by price ranges)
      const priceDistribution = await this.getPriceDistribution();

      return {
        total: totalCount,
        active: activeCount,
        inactive: inactiveCount,
        recentlyAdded,
        recentlyUpdated,
        priceStatistics: {
          average: parseFloat(priceStats?.dataValues?.avgPrice || 0).toFixed(2),
          minimum: parseFloat(priceStats?.dataValues?.minPrice || 0).toFixed(2),
          maximum: parseFloat(priceStats?.dataValues?.maxPrice || 0).toFixed(2),
          range: parseFloat((priceStats?.dataValues?.maxPrice || 0) - (priceStats?.dataValues?.minPrice || 0)).toFixed(2)
        },
        priceDistribution,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getBrickTypeStats:', error);
      throw new Error('Failed to retrieve brick type statistics');
    }
  }

  /**
   * Get price distribution by ranges
   */
  async getPriceDistribution() {
    try {
      const priceRanges = [
        { label: 'Under $1', min: 0, max: 1 },
        { label: '$1 - $5', min: 1, max: 5 },
        { label: '$5 - $10', min: 5, max: 10 },
        { label: '$10 - $25', min: 10, max: 25 },
        { label: '$25 - $50', min: 25, max: 50 },
        { label: 'Over $50', min: 50, max: Infinity }
      ];

      const distribution = [];

      for (const range of priceRanges) {
        const whereClause = {
          isActive: true,
          pricePerBrick: {
            [Op.gte]: range.min
          }
        };

        if (range.max !== Infinity) {
          whereClause.pricePerBrick[Op.lt] = range.max;
        }

        const count = await BrickType.count({ where: whereClause });

        distribution.push({
          range: range.label,
          count,
          minPrice: range.min,
          maxPrice: range.max === Infinity ? null : range.max
        });
      }

      return distribution;
    } catch (error) {
      console.error('Error in getPriceDistribution:', error);
      throw new Error('Failed to calculate price distribution');
    }
  }

  /**
   * Search brick types with advanced criteria
   */
  async searchBrickTypes(searchOptions = {}) {
    try {
      const {
        query,
        exactMatch = false,
        priceMin,
        priceMax,
        isActive,
        createdAfter,
        createdBefore,
        sortBy = 'name',
        sortOrder = 'ASC',
        page = 1,
        limit = 10
      } = searchOptions;

      const whereClause = {};

      // Text search
      if (query) {
        if (exactMatch) {
          whereClause.name = { [Op.iLike]: query.trim() };
        } else {
          whereClause.name = { [Op.iLike]: `%${query.trim()}%` };
        }
      }

      // Price filtering
      if (priceMin !== undefined || priceMax !== undefined) {
        whereClause.pricePerBrick = {};
        if (priceMin !== undefined) {
          whereClause.pricePerBrick[Op.gte] = priceMin;
        }
        if (priceMax !== undefined) {
          whereClause.pricePerBrick[Op.lte] = priceMax;
        }
      }

      // Status filtering
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      // Date filtering
      if (createdAfter || createdBefore) {
        whereClause.createdAt = {};
        if (createdAfter) {
          whereClause.createdAt[Op.gte] = new Date(createdAfter);
        }
        if (createdBefore) {
          whereClause.createdAt[Op.lte] = new Date(createdBefore);
        }
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await BrickType.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        attributes: ['id', 'name', 'pricePerBrick', 'isActive', 'createdAt', 'updatedAt']
      });

      return {
        results: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        },
        searchCriteria: searchOptions
      };
    } catch (error) {
      console.error('Error in searchBrickTypes:', error);
      throw new Error('Failed to search brick types');
    }
  }

  /**
   * Get brick types by price range
   */
  async getBrickTypesByPriceRange(minPrice, maxPrice, options = {}) {
    try {
      const {
        isActive = true,
        sortBy = 'pricePerBrick',
        sortOrder = 'ASC',
        page = 1,
        limit = 50
      } = options;

      const whereClause = {
        pricePerBrick: {
          [Op.gte]: minPrice,
          [Op.lte]: maxPrice
        }
      };

      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await BrickType.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        attributes: ['id', 'name', 'pricePerBrick', 'isActive', 'createdAt', 'updatedAt']
      });

      return {
        brickTypes: rows,
        priceRange: { min: minPrice, max: maxPrice },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      console.error('Error in getBrickTypesByPriceRange:', error);
      throw new Error('Failed to retrieve brick types by price range');
    }
  }

  /**
   * Bulk update brick types
   */
  async bulkUpdateBrickTypes(updates) {
    const transaction = await BrickType.sequelize.transaction();
    const updated = [];
    const failed = [];

    try {
      for (const update of updates) {
        try {
          const { id, ...updateData } = update;

          if (!id) {
            failed.push({
              data: update,
              error: 'ID is required for each update'
            });
            continue;
          }

          const brickType = await BrickType.findByPk(id, { transaction });

          if (!brickType) {
            failed.push({
              data: update,
              error: 'Brick type not found'
            });
            continue;
          }

          // Check for name conflicts if name is being updated
          if (updateData.name && updateData.name !== brickType.name) {
            const existingBrickType = await BrickType.findOne({
              where: { 
                name: { [Op.iLike]: updateData.name.trim() },
                id: { [Op.ne]: id }
              },
              transaction
            });

            if (existingBrickType) {
              failed.push({
                data: update,
                error: 'Brick type with this name already exists'
              });
              continue;
            }
          }

          // Prepare clean update data
          const cleanUpdateData = {};
          if (updateData.name !== undefined) {
            cleanUpdateData.name = updateData.name.trim();
          }
          if (updateData.pricePerBrick !== undefined) {
            cleanUpdateData.pricePerBrick = parseFloat(updateData.pricePerBrick);
          }
          if (updateData.isActive !== undefined) {
            cleanUpdateData.isActive = updateData.isActive;
          }

          await brickType.update(cleanUpdateData, { transaction });
          
          // Get fresh instance for response
          const updatedBrickType = await BrickType.findByPk(id, { transaction });
          updated.push(updatedBrickType);

        } catch (error) {
          failed.push({
            data: update,
            error: error.message
          });
        }
      }

      await transaction.commit();
      return { updated, failed };
    } catch (error) {
      await transaction.rollback();
      console.error('Error in bulkUpdateBrickTypes:', error);
      throw error;
    }
  }

  /**
   * Bulk delete brick types
   */
  async bulkDeleteBrickTypes(ids) {
    const transaction = await BrickType.sequelize.transaction();
    const deleted = [];
    const failed = [];

    try {
      for (const id of ids) {
        try {
          const brickType = await BrickType.findByPk(id, { transaction });

          if (!brickType) {
            failed.push({
              id,
              error: 'Brick type not found'
            });
            continue;
          }

          // Store info before deletion
          const brickTypeInfo = {
            id: brickType.id,
            name: brickType.name,
            pricePerBrick: brickType.pricePerBrick
          };

          await brickType.destroy({ transaction });
          deleted.push(brickTypeInfo);

        } catch (error) {
          failed.push({
            id,
            error: error.message
          });
        }
      }

      await transaction.commit();
      return { deleted, failed };
    } catch (error) {
      await transaction.rollback();
      console.error('Error in bulkDeleteBrickTypes:', error);
      throw error;
    }
  }

  /**
   * Validate brick type data
   */
  validateBrickTypeData(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate || data.name !== undefined) {
      if (!data.name || typeof data.name !== 'string') {
        errors.push('Name is required and must be a string');
      } else if (data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      } else if (data.name.trim().length > 100) {
        errors.push('Name cannot exceed 100 characters');
      }
    }

    if (!isUpdate || data.pricePerBrick !== undefined) {
      if (data.pricePerBrick === undefined || data.pricePerBrick === null) {
        errors.push('Price per brick is required');
      } else if (typeof data.pricePerBrick !== 'number' || isNaN(data.pricePerBrick)) {
        errors.push('Price per brick must be a valid number');
      } else if (data.pricePerBrick <= 0) {
        errors.push('Price per brick must be greater than 0');
      } else if (data.pricePerBrick > 9999999.99) {
        errors.push('Price per brick cannot exceed 9,999,999.99');
      }
    }

    if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
      errors.push('isActive must be a boolean value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new BrickTypeService();