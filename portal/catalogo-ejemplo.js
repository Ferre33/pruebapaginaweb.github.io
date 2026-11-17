const tr=(es,en)=>window.BEBEPUNT_I18N?.text(es,en)||es;
// Illustrative catalog only. No real commercial specifications or purchasable IDs.
window.BEBEPUNT_GET_DEMO_CATALOG = () => ({
  "collections": [
    {
      "id": "demo-otono",
      "name": tr("Otoño Invierno 26/27","Autumn Winter 26/27"),
      "season": tr("Calidez para sus primeros días","Warmth for their first days"),
      "slug": "otono",
      "cover": "otono-invierno-proximamente.webp",
      "coming_soon": true
    },
    {
      "id": "demo-primavera",
      "name": tr("Verano 27","Summer 27"),
      "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine"),
      "slug": "primavera",
      "cover": "bebe1.jpg"
    },
    {
      "id": "demo-ceremonia",
      "name": tr("Ceremonia","Special occasions"),
      "season": tr("Momentos para recordar","Moments to remember"),
      "slug": "ceremonia",
      "cover": "ceremonia5.jpg"
    }
  ],
  "products": [
    {
      "id": "demo-modelo-01",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Conjunto Trépoles color Rosa Palo","Trépoles Set in Dusty Pink"),
      "description": tr("Punto rosa y cuello blanco para un conjunto de aire delicado.","Pink knitwear and a white collar for a delicate look."),
      "demo_image": "bebe2.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-01-0",
          "sku": "MUESTRA-01-1",
          "size": "3 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 32,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-01-1",
          "sku": "MUESTRA-01-2",
          "size": "6 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 32,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-01-2",
          "sku": "MUESTRA-01-3",
          "size": "12 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 32,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-02",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Vestido Nube color Nude","Nube Dress in Nude"),
      "description": tr("Un diseño de inspiración clásica en tonos cálidos.","A classically inspired design in warm shades."),
      "demo_image": "bebe4.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-02-0",
          "sku": "MUESTRA-02-1",
          "size": "3 M",
          "color": tr("Canela","Cinnamon"),
          "professional_price": 38,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-02-1",
          "sku": "MUESTRA-02-2",
          "size": "6 M",
          "color": tr("Canela","Cinnamon"),
          "professional_price": 38,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-02-2",
          "sku": "MUESTRA-02-3",
          "size": "12 M",
          "color": tr("Canela","Cinnamon"),
          "professional_price": 38,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-03",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Dos piezas Galga 12","Galga 12 Two-piece Set"),
      "description": tr("Una propuesta de punto azul para los primeros meses.","Blue knitwear for the first months."),
      "demo_image": "bebe8.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-03-0",
          "sku": "MUESTRA-03-1",
          "size": "3 M",
          "color": tr("Azul","Blue"),
          "professional_price": 34,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-03-1",
          "sku": "MUESTRA-03-2",
          "size": "6 M",
          "color": tr("Azul","Blue"),
          "professional_price": 34,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-03-2",
          "sku": "MUESTRA-03-3",
          "size": "12 M",
          "color": tr("Azul","Blue"),
          "professional_price": 34,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-04",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Conjunto Jardín","Jardín Set"),
      "description": tr("Chaqueta clara combinada con una prenda inferior azul.","A light cardigan paired with blue bottoms."),
      "demo_image": "bebe12.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-04-0",
          "sku": "MUESTRA-04-1",
          "size": "3 M",
          "color": tr("Marfil / azul","Ivory / blue"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-04-1",
          "sku": "MUESTRA-04-2",
          "size": "6 M",
          "color": tr("Marfil / azul","Ivory / blue"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-04-2",
          "sku": "MUESTRA-04-3",
          "size": "12 M",
          "color": tr("Marfil / azul","Ivory / blue"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-05",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Dos piezas Faro color Lavanda","Faro Two-piece Set in Lavender"),
      "description": tr("Silueta cómoda en azul suave, con cuello en contraste.","A comfortable silhouette in soft blue with a contrasting collar."),
      "demo_image": "bebe14.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-05-0",
          "sku": "MUESTRA-05-1",
          "size": "3 M",
          "color": tr("Azul","Blue"),
          "professional_price": 33,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-05-1",
          "sku": "MUESTRA-05-2",
          "size": "6 M",
          "color": tr("Azul","Blue"),
          "professional_price": 33,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-05-2",
          "sku": "MUESTRA-05-3",
          "size": "12 M",
          "color": tr("Azul","Blue"),
          "professional_price": 33,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-07",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Pelele Salvia color Verde Empolvado","Salvia Romper in Dusty Green"),
      "description": tr("Una propuesta bicolor para descubrir el mundo.","A two-tone design for discovering the world."),
      "demo_image": "bebe1.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-07-0",
          "sku": "MUESTRA-07-1",
          "size": "3 M",
          "color": tr("Verde / natural","Green / natural"),
          "professional_price": 29,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-07-1",
          "sku": "MUESTRA-07-2",
          "size": "6 M",
          "color": tr("Verde / natural","Green / natural"),
          "professional_price": 29,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-07-2",
          "sku": "MUESTRA-07-3",
          "size": "12 M",
          "color": tr("Verde / natural","Green / natural"),
          "professional_price": 29,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-08",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Vestido Lavanda","Lavanda Dress"),
      "description": tr("Tonos claros con detalles rojos llenos de alegría.","Light shades with cheerful red details."),
      "demo_image": "bebe3.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-08-0",
          "sku": "MUESTRA-08-1",
          "size": "3 M",
          "color": tr("Natural / rojo","Natural / red"),
          "professional_price": 31,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-08-1",
          "sku": "MUESTRA-08-2",
          "size": "6 M",
          "color": tr("Natural / rojo","Natural / red"),
          "professional_price": 31,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-08-2",
          "sku": "MUESTRA-08-3",
          "size": "12 M",
          "color": tr("Natural / rojo","Natural / red"),
          "professional_price": 31,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-09",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Peto Aguamarina","Aguamarina Dungarees"),
      "description": tr("Conjunto sin mangas en un fresco tono turquesa.","A sleeveless set in a fresh turquoise shade."),
      "demo_image": "bebe6.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-09-0",
          "sku": "MUESTRA-09-1",
          "size": "3 M",
          "color": tr("Turquesa","Turquoise"),
          "professional_price": 28,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-09-1",
          "sku": "MUESTRA-09-2",
          "size": "6 M",
          "color": tr("Turquesa","Turquoise"),
          "professional_price": 28,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-09-2",
          "sku": "MUESTRA-09-3",
          "size": "12 M",
          "color": tr("Turquesa","Turquoise"),
          "professional_price": 28,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-10",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Vestido Brisa color Melocotón","Brisa Dress in Peach"),
      "description": tr("Contraste de punto coral y tejido claro.","Contrasting coral knitwear and light fabric."),
      "demo_image": "bebe9.png",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-10-0",
          "sku": "MUESTRA-10-1",
          "size": "3 M",
          "color": tr("Coral / crudo","Coral / ecru"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-10-1",
          "sku": "MUESTRA-10-2",
          "size": "6 M",
          "color": tr("Coral / crudo","Coral / ecru"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-10-2",
          "sku": "MUESTRA-10-3",
          "size": "12 M",
          "color": tr("Coral / crudo","Coral / ecru"),
          "professional_price": 36,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-11",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Vestido Lunares","Lunares Dress"),
      "description": tr("Verde y blanco para una silueta de inspiración campestre.","Green and white for a countryside-inspired silhouette."),
      "demo_image": "bebe13.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-11-0",
          "sku": "MUESTRA-11-1",
          "size": "3 M",
          "color": tr("Verde / blanco","Green / white"),
          "professional_price": 39,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-11-1",
          "sku": "MUESTRA-11-2",
          "size": "6 M",
          "color": tr("Verde / blanco","Green / white"),
          "professional_price": 39,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-11-2",
          "sku": "MUESTRA-11-3",
          "size": "12 M",
          "color": tr("Verde / blanco","Green / white"),
          "professional_price": 39,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-12",
      "collection_id": "demo-primavera",
      "collections": {
        "id": "demo-primavera",
        "name": tr("Verano 27","Summer 27"),
        "season": tr("Pequeñas aventuras al sol","Little adventures in the sunshine")
      },
      "name": tr("Pichi Trépoles","Trépoles Pinafore"),
      "description": tr("Una ranita rosa de líneas sencillas.","A pink romper with clean lines."),
      "demo_image": "bebe17.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": false,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-12-0",
          "sku": "MUESTRA-12-1",
          "size": "3 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 30,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-12-1",
          "sku": "MUESTRA-12-2",
          "size": "6 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 30,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-12-2",
          "sku": "MUESTRA-12-3",
          "size": "12 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 30,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-13",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Conjunto Avellana","Hazelnut Set"),
      "description": tr("Punto en tono avellana y cuello blanco de inspiración romántica.","Hazelnut knitwear and a romantic white collar."),
      "demo_image": "ceremonia1.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-13-0",
          "sku": "MUESTRA-13-1",
          "size": "3 M",
          "color": tr("Avellana","Hazelnut"),
          "professional_price": 42,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-13-1",
          "sku": "MUESTRA-13-2",
          "size": "6 M",
          "color": tr("Avellana","Hazelnut"),
          "professional_price": 42,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-13-2",
          "sku": "MUESTRA-13-3",
          "size": "12 M",
          "color": tr("Avellana","Hazelnut"),
          "professional_price": 42,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    {
      "id": "demo-modelo-14",
      "collection_id": "demo-ceremonia",
      "collections": {
        "id": "demo-ceremonia",
        "name": tr("Ceremonia","Special occasions"),
        "season": tr("Momentos para recordar","Moments to remember")
      },
      "name": tr("Conjunto Magnolia","Magnolia Set"),
      "description": tr("Punto rosa empolvado y detalles blancos para una ocasión especial.","Dusty pink knitwear with white details for a special occasion."),
      "demo_image": "ceremonia2.jpg",
      "is_demo": true,
      "is_active": true,
      "is_orderable": true,
      "made_to_order": true,
      "lead_time": tr("Plazo orientativo: 4–6 semanas. Pendiente de validación.","Estimated lead time: 4–6 weeks. Subject to confirmation."),
      "composition": tr("Ficha de muestra. La composición real debe confirmarse con el fabricante.","Sample specification. Confirm the actual composition with the manufacturer."),
      "washing": tr("Ficha de muestra. Consultar la etiqueta real de la prenda antes de su lavado.","Sample specification. Check the garment's actual care label before washing."),
      "size_guide": [],
      "product_variants": [
        {
          "id": "demo-modelo-14-0",
          "sku": "MUESTRA-14-1",
          "size": "3 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 43,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-14-1",
          "sku": "MUESTRA-14-2",
          "size": "6 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 43,
          "stock": 0,
          "is_active": true
        },
        {
          "id": "demo-modelo-14-2",
          "sku": "MUESTRA-14-3",
          "size": "12 M",
          "color": tr("Rosa","Pink"),
          "professional_price": 43,
          "stock": 0,
          "is_active": true
        }
      ]
    },
    // Confirmed ceremony sheets; existing prices are for the admin simulation only.
    ...[
      [17, '27.101', 'Jesusito + braguita punto Aura', 'Aura baby dress and knitted bloomers', 'ceremonia5.jpg', 'M', 'Crudo', 'Ecru', '100 % algodón', '100% cotton', 52],
      [21, '27.102', 'Jesusito + braguita punto Alma', 'Alma baby dress and knitted bloomers', 'ceremonia9.jpg', 'M', 'Crudo', 'Ecru', '100 % algodón', '100% cotton', 49],
      [16, '27.401', 'Pelele canesú Alma', 'Alma yoke romper', 'ceremonia4.jpg', 'M', 'Crudo', 'Ecru', 'Punto: 100 % algodón', 'Knit: 100% cotton', 40],
      [23, '27.402', 'Pelele Alma', 'Alma romper', 'ceremonia-27-402.jpg', 'M', 'Piedra', 'Stone', '100 % algodón', '100% cotton', null],
      [22, '27.907', 'Camisa y peto Alma', 'Alma shirt and dungarees', 'ceremonia10.jpg', 'M', 'Único', 'Single colour', '', '', 53],
      [15, '27.712', 'Blusa y pantalón Aura', 'Aura blouse and trousers', 'ceremonia3.jpg', 'A', 'Único', 'Single colour', '', '', 48],
      [18, '27.904', 'Vestido niña Aura', "Aura girls’ dress", 'ceremonia6.jpg', 'A', 'Único', 'Single colour', '', '', 58],
      [19, '27.908', 'Camisa y bombacho Alma', 'Alma shirt and bloomer shorts', 'ceremonia7.jpg', 'A', 'Único', 'Single colour', '', '', 54],
      [20, '27.909', 'Vestido Alma', 'Alma dress', 'ceremonia8.jpg', 'A', 'Único', 'Single colour', '', '', 57]
    ].map(([n,reference,es,en,demo_image,unit,colour,colourEn,material,materialEn,price])=>{
      const id='demo-modelo-'+n, sizes=unit==='M'?[0,1,3,6,9,12,18,24,36]:[2,3,4,5,6];
      return {id,reference,name:tr(es,en),demo_image,collection_id:'demo-ceremonia',
        collections:{id:'demo-ceremonia',name:tr('Ceremonia','Special occasions')},
        composition:tr(material,materialEn),size_guide:[],is_demo:true,is_active:true,is_orderable:true,made_to_order:true,
        product_variants:sizes.map(size=>({id:id+'-'+size+unit,sku:reference+'-'+size+unit,
          size:size+' '+(unit==='M'?(size===1?tr('mes','month'):tr('meses','months')):tr('años','years')),color:tr(colour,colourEn),
          professional_price:price,stock:0,is_active:true}))
      };
    })
  ]
});
