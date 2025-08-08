// controllers/brickTypeController.js - Complete enhanced version
'use strict';

const brickTypeService = require('../services/bricktypesService');


class BrickTypeController {
  /**
   * Get all brick types with enhanced filtering and pagination
   */
  async getAllBrickTypes(req, res) {
    try {
      // Validation is handled by middleware, so we can trust req.query
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
        search: req.query.search?.trim(),
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder?.toUpperCase() || 'DESC',
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined
      };

      const result = await brickTypeService.getAllBrickTypes(options);

      res.status(200).json({
        success: true,
        message: 'Brick types retrieved successfully',
        data: result.brickTypes,
        pagination: result.pagination,
        filters: {
          isActive: options.isActive,
          search: options.search,
          priceRange: {
            min: options.minPrice,
            max: options.maxPrice
          },
          sortBy: options.sortBy,
          sortOrder: options.sortOrder
        }
      });
    } catch (error) {
      console.error('Error getting brick types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve brick types',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get only active brick types
   */
  async getActiveBrickTypes(req, res) {
    try {
      const result = await brickTypeService.getActiveBrickTypes();

      res.status(200).json({
        success: true,
        message: 'Active brick types retrieved successfully',
        data: result,
        count: result.length
      });
    } catch (error) {
      console.error('Error getting active brick types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active brick types',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get brick type by ID
   */
  async getBrickTypeById(req, res) {
    try {
      const { id } = req.params;
      const brickType = await brickTypeService.getBrickTypeById(id);

      if (!brickType) {
        return res.status(404).json({
          success: false,
          message: 'Brick type not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Brick type retrieved successfully',
        data: brickType
      });
    } catch (error) {
      console.error('Error getting brick type by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve brick type',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Create new brick type
   */
  async createBrickType(req, res) {
    try {
      // Data is already validated and sanitized by middleware
      const { name, pricePerBrick, isActive } = req.body;
      console.log(req.body);
      const brickType = await brickTypeService.createBrickType({
        name: name.trim(),
        pricePerBrick: parseFloat(pricePerBrick),
        isActive: isActive !== undefined ? isActive : true
      });

      res.status(201).json({
        success: true,
        message: 'Brick type created successfully',
        data: brickType
      });
    } catch (error) {
      console.error('Error creating brick type:', error);
      
      // Handle specific business logic errors
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: error.message,
          field: 'name'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create brick type',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update brick type by ID
   */
async updateBrickType(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    // Transaction ID for better logging
    const transactionId = Math.random().toString(36).substring(2, 9);
    console.log(`[${transactionId}] Starting update for brick type ${id}`);

    try {
        // Input validation
        if (!id || isNaN(Number(id))) {
            throw new Error('Invalid brick type ID');
        }

        // Sanitize and validate input
        const sanitizedData = {};
        
        // Name validation
        if (updateData.name !== undefined) {
            if (typeof updateData.name !== 'string') {
                throw new Error('Name must be a string');
            }
            
            const trimmedName = updateData.name.trim();
            if (trimmedName.length < 2 || trimmedName.length > 100) {
                throw new Error('Name must be between 2-100 characters');
            }
            sanitizedData.name = trimmedName;
        }

        // Price validation
        if (updateData.pricePerBrick !== undefined) {
            const price = Number(updateData.pricePerBrick);
            if (isNaN(price) || !isFinite(price)) {
                throw new Error('Price must be a valid number');
            }
            if (price <= 0) {
                throw new Error('Price must be greater than 0');
            }
            sanitizedData.pricePerBrick = parseFloat(price.toFixed(2));
        }

        // Check if any valid fields were provided
        if (Object.keys(sanitizedData).length === 0) {
            throw new Error('No valid fields provided for update');
        }

        console.log(`[${transactionId}] Validated update data:`, sanitizedData);

        // Perform update
        const brickType = await brickTypeService.updateBrickType(id, sanitizedData);

        if (!brickType) {
            console.warn(`[${transactionId}] Brick type not found - ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Brick type not found',
                errorCode: 'BRICK_TYPE_NOT_FOUND'
            });
        }

        console.log(`[${transactionId}] Successfully updated brick type ${id}`);
        
        res.status(200).json({
            success: true,
            message: 'Brick type updated successfully',
            data: brickType,
            updatedFields: Object.keys(sanitizedData)
        });

    } catch (error) {
        console.error(`[${transactionId}] Update error:`, error.message);
        
        // Handle known error types
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message,
                errorCode: 'DUPLICATE_NAME',
                field: 'name'
            });
        }

        if (error.message.includes('Invalid') || 
            error.message.includes('must be') || 
            error.message.includes('No valid fields')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                errorCode: 'VALIDATION_ERROR'
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: 'Failed to update brick type',
            errorCode: 'INTERNAL_ERROR',
            ...(process.env.NODE_ENV === 'development' && {
                debug: {
                    message: error.message,
                    stack: error.stack
                }
            })
        });
    }
}
  /**
   * Toggle brick type active status
   */
  async toggleBrickTypeStatus(req, res) {
    try {
      const { id } = req.params;
      const brickType = await brickTypeService.toggleBrickTypeStatus(id);

      if (!brickType) {
        return res.status(404).json({
          success: false,
          message: 'Brick type not found'
        });
      }

      res.status(200).json({
        success: true,
        message: `Brick type ${brickType.isActive ? 'activated' : 'deactivated'} successfully`,
        data: brickType
      });
    } catch (error) {
      console.error('Error toggling brick type status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle brick type status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Delete brick type by ID
   */
  async deleteBrickType(req, res) {
    try {
      const { id } = req.params;
      const success = await brickTypeService.deleteBrickType(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Brick type not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Brick type deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting brick type:', error);
      
      // Handle foreign key constraint errors
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Cannot delete brick type as it is being used in other records'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete brick type',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Bulk create brick types
   */
  async bulkCreateBrickTypes(req, res) {
    try {
      const { brickTypes } = req.body;

      // Additional validation is handled by middleware
      const result = await brickTypeService.bulkCreateBrickTypes(brickTypes);

      const statusCode = result.failed.length > 0 ? 207 : 201; // 207 for partial success

      res.status(statusCode).json({
        success: true,
        message: `Bulk operation completed. ${result.created.length} created, ${result.failed.length} failed`,
        data: {
          created: result.created,
          failed: result.failed,
          summary: {
            totalRequested: brickTypes.length,
            successful: result.created.length,
            failed: result.failed.length
          }
        }
      });
    } catch (error) {
      console.error('Error bulk creating brick types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk create brick types',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get brick types with price comparison
   */
  async getBrickTypesWithPriceComparison(req, res) {
    try {
      const comparison = await brickTypeService.getPriceComparison();

      res.status(200).json({
        success: true,
        message: 'Price comparison retrieved successfully',
        data: {
          brickTypes: comparison.brickTypes,
          statistics: {
            averagePrice: comparison.averagePrice,
            totalTypes: comparison.brickTypes.length,
            priceRange: {
              lowest: comparison.brickTypes.length > 0 ? 
                Math.min(...comparison.brickTypes.map(bt => bt.pricePerBrick)) : 0,
              highest: comparison.brickTypes.length > 0 ? 
                Math.max(...comparison.brickTypes.map(bt => bt.pricePerBrick)) : 0
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting price comparison:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve price comparison',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get brick type statistics
   */
  async getBrickTypeStats(req, res) {
    try {
      const stats = await brickTypeService.getBrickTypeStats();

      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting brick type statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Search brick types (advanced search with multiple criteria)
   */
  async searchBrickTypes(req, res) {
    try {
      const {
        query,
        priceRange,
        isActive,
        sortBy = 'relevance',
        page = 1,
        limit = 10
      } = req.query;

      let searchOptions = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy: sortBy === 'relevance' ? 'name' : sortBy,
        sortOrder: 'ASC'
      };

      // Handle text search
      if (query) {
        searchOptions.search = query.trim();
      }

      // Handle price range
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(p => parseFloat(p));
        if (!isNaN(min)) searchOptions.minPrice = min;
        if (!isNaN(max)) searchOptions.maxPrice = max;
      }

      // Handle active filter
      if (isActive !== undefined) {
        searchOptions.isActive = isActive === 'true';
      }

      const result = await brickTypeService.getAllBrickTypes(searchOptions);

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: result.brickTypes,
        pagination: result.pagination,
        searchCriteria: {
          query,
          priceRange,
          isActive,
          sortBy
        }
      });
    } catch (error) {
      console.error('Error searching brick types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search brick types',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Bulk update brick types
   */
  async bulkUpdateBrickTypes(req, res) {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Updates array is required and must not be empty'
        });
      }

      if (updates.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Cannot update more than 50 brick types at once'
        });
      }

      const results = {
        updated: [],
        failed: []
      };

      for (const update of updates) {
        try {
          const { id, ...updateData } = update;
          
          if (!id) {
            results.failed.push({
              data: update,
              error: 'ID is required for each update'
            });
            continue;
          }

          const brickType = await brickTypeService.updateBrickType(id, updateData);
          
          if (brickType) {
            results.updated.push(brickType);
          } else {
            results.failed.push({
              data: update,
              error: 'Brick type not found'
            });
          }
        } catch (error) {
          results.failed.push({
            data: update,
            error: error.message
          });
        }
      }

      const statusCode = results.failed.length > 0 ? 207 : 200;

      res.status(statusCode).json({
        success: true,
        message: `Bulk update completed. ${results.updated.length} updated, ${results.failed.length} failed`,
        data: {
          updated: results.updated,
          failed: results.failed,
          summary: {
            totalRequested: updates.length,
            successful: results.updated.length,
            failed: results.failed.length
          }
        }
      });
    } catch (error) {
      console.error('Error bulk updating brick types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk update brick types',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Export brick types data
   */
  async exportBrickTypes(req, res) {
    try {
      const { format = 'json', isActive } = req.query;

      const options = {
        page: 1,
        limit: 10000, // Large limit to get all records
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        sortBy: 'name',
        sortOrder: 'ASC'
      };

      const result = await brickTypeService.getAllBrickTypes(options);

      if (format === 'csv') {
        // Convert to CSV format
        const csvHeaders = 'ID,Name,Price Per Brick,Active,Created At,Updated At\n';
        const csvData = result.brickTypes.map(bt => 
          `${bt.id},"${bt.name}",${bt.pricePerBrick},${bt.isActive},${bt.createdAt},${bt.updatedAt}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=brick-types.csv');
        res.send(csvHeaders + csvData);
      } else {
        // JSON format (default)
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=brick-types.json');
        res.json({
          exportedAt: new Date().toISOString(),
          totalRecords: result.pagination.totalItems,
          data: result.brickTypes
        });
      }
    } catch (error) {
      console.error('Error exporting brick types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export brick types',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new BrickTypeController();