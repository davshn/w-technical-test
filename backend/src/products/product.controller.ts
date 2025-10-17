import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './product.service';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los productos',
    description: 'Obtiene el catálogo completo de productos disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    type: [Product],
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nuevo producto',
    description: 'Agrega un nuevo producto al inventario',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'El nombre es requerido',
          'La cantidad no puede ser negativa',
        ],
        error: 'Bad Request',
      },
    },
  })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar producto',
    description: 'Modifica los datos de un producto existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    type: 'integer',
    example: 1,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }
}
