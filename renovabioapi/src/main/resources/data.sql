INSERT INTO cidade (id, estado, nome) VALUES
(1, 'RS', 'Caibaté'),
(2, 'RS', 'São Luiz Gonzaga'),
(3, 'RS', 'Santo Ângelo'),
(4, 'RS', 'Bossoroca'),
(5, 'RS', 'Cerro Largo'),
(6, 'RS', 'Dezesseis de Novembro'),
(7, 'RS', 'Entre-Ijuís'),
(8, 'RS', 'Eugênio de Castro'),
(9, 'RS', 'Garruchos'),
(10, 'RS', 'Giruá'),
(11, 'RS', 'Guarani das Missões'),
(12, 'RS', 'Mato Queimado'),
(13, 'RS', 'Pirapó'),
(14, 'RS', 'Porto Xavier'),
(15, 'RS', 'Rolador'),
(16, 'RS', 'Roque Gonzales'),
(17, 'RS', 'Salvador das Missões'),
(18, 'RS', 'Santo Antônio das Missões'),
(19, 'RS', 'São Borja'),
(20, 'RS', 'São Miguel das Missões'),
(21, 'RS', 'São Paulo das Missões'),
(22, 'RS', 'São Nicolau'),
(23, 'RS', 'São Pedro do Butiá'),
(24, 'RS', 'Sete de Setembro'),
(25, 'RS', 'Ubiretama'),
(26, 'RS', 'Vitória das Missões');



INSERT INTO categoria (id_Categoria, nome_Categoria, tipo) VALUES
(1,'Doces','RECEITA'),
(2,'Reaproveitamento','RECEITA'),
(3,'Compostagem','DESAFIO'),
(4,'Redução de resíduos','DESAFIO'),
(5,'Reciclagem','DESAFIO'),
(6,'Salgados','RECEITA'),
(7,'Bebidas','RECEITA');


INSERT INTO parceiro (id_parceiros, ativo, descricao, nome_parceiro, cidade_id_cidade) VALUES
(1,1,'Descontos em produtos','Supermercado Laçador',1),
(2,1,'Descontos em produtos','SB Malhas',1),
(3,0,'Descontos em produtos','Farmácia São João',3),
(4,1,'Descontos em combustíveis','Posto Ipiranga',12),
(5,1,'Descontos em produtos','Padaria Both',1),
(6,1,'Descontos em produtos','Loja da Economia',20);


INSERT INTO receita (id_receita, titulo_receita, descricao, ingredientes, modo_preparo, tempo_preparo, dificuldade, pontos, categoria_id_categoria) VALUES
(1,'Bolo de Casca de Banana','Reaproveitamento de casca',
'Cascas de banana, farinha','Misturar e assar',40,'FACIL',10,1),

(2,'Arroz de Sobras','Reaproveitamento de arroz',
'Arroz cozido, temperos','Refogar ingredientes',25,'FACIL',10,1),

(3,'Bolo de Laranja com Casca','Reaproveitamento da casca da laranja',
'Laranja com casca, ovos, acucar, oleo, farinha, fermento',
'Bater os ingredientes liquidos no liquidificador, misturar com farinha e fermento e assar.',
40,'FACIL',10,1),

(4,'Bolo de Laranja com Casca de Maca e Aveia','Aproveitamento de cascas de frutas',
'Suco de laranja, maca com casca, aveia, ovos, farinha, acucar mascavo',
'Misturar ingredientes secos, adicionar liquidos e assar.',
40,'MEDIA',12,1),

(5,'Geleia de Manga Sem Acucar','Aproveitamento de frutas maduras',
'Manga, suco de laranja, sal',
'Cozinhar a manga com suco ate reduzir e atingir consistencia de geleia.',
30,'FACIL',10,1),

(6,'Doce de Casca de Mamao','Reaproveitamento da casca do mamao',
'Cascas de mamao, acucar',
'Cozinhar as cascas, bater e levar ao fogo ate dar ponto.',
45,'MEDIA',12,1),

(7,'Bolo de Casca de Abacaxi','Reaproveitamento da casca do abacaxi',
'Ovos, farinha, acucar, caldo da casca de abacaxi',
'Preparar massa com o caldo da casca e assar.',
40,'FACIL',10,1),

(8,'Casca de Laranja Cristalizada','Aproveitamento da casca de laranja',
'Cascas de laranja, acucar, agua',
'Cozinhar as cascas e finalizar em calda de acucar.',
35,'MEDIA',12,1),

(9,'Docinho de Abacaxi com Coco','Reaproveitamento da casca de abacaxi',
'Suco da casca de abacaxi, coco ralado, acucar, gemas',
'Cozinhar todos os ingredientes até formar massa consistente.',
30,'MEDIA',12,1),

(10,'Cocada de Entrecasca de Melancia','Reaproveitamento da entrecasca da melancia',
'Entrecasca de melancia, coco, acucar',
'Cozinhar ate obter consistencia de cocada.',
35,'MEDIA',12,1),

(11,'Pao Doce de Abacaxi','Uso do suco da casca de abacaxi na massa',
'Fermento, acucar, ovos, suco de casca de abacaxi, farinha',
'Preparar massa, deixar crescer e assar.',
60,'MEDIA',15,1),

(12,'Arroz de Talos','Aproveitamento de talos de verduras',
'Arroz, talos de salsa e couve, alho',
'Refogar os talos com arroz e cozinhar.',
25,'FACIL',10,1),

(13,'Arroz de Casca de Abobora','Reaproveitamento de casca de abobora',
'Cascas de abobora, arroz cozido, creme de leite',
'Cozinhar as cascas e misturar com arroz e creme.',
30,'FACIL',10,1),

(14,'Chips de Cascas e Sementes','Snack sustentavel',
'Cascas de cenoura, batata, sementes de abobora, azeite',
'Temperar e assar até dourar.',
20,'FACIL',10,1),

(15,'Farofa de Casca de Melancia','Reaproveitamento da casca da melancia',
'Cascas de melancia, farinha de mandioca, alho',
'Refogar e misturar com farinha.',
20,'FACIL',10,1),

(16,'Pao de Folhas e Talos','Uso integral de folhas e talos',
'Folhas e talos variados, farinha, fermento',
'Bater ingredientes, preparar massa e assar.',
50,'MEDIA',15,1),

(17,'Pao de Abobora com Sementes','Uso de sementes e polpa da abobora',
'Farinha, abobora, sementes, fermento',
'Preparar massa e assar.',
45,'MEDIA',15,1),

(18,'Bolinho de Casca de Batata','Reaproveitamento da casca da batata',
'Cascas de batata, ovos, farinha',
'Preparar massa e fritar bolinhos.',
25,'FACIL',10,1),

(19,'Bolinho de Folhas e Talos','Aproveitamento integral de vegetais',
'Folhas, talos, ovos, farinha',
'Refogar folhas, misturar com massa e fritar.',
25,'FACIL',10,1),

(20,'Gratinado de Folhas de Couve-Flor','Uso das folhas da couve-flor',
'Folhas de couve-flor, azeite, queijo',
'Refogar folhas e gratinar no forno.',
25,'FACIL',10,1),

(21,'Sopa de Talos e Cascas','Sopa nutritiva com reaproveitamento',
'Talos, cascas de legumes, cebola, alho',
'Cozinhar ingredientes e bater ate formar sopa.',
35,'FACIL',12,1),

(22,'Refogado de Cascas de Legumes','Reaproveitamento de cascas variadas',
'Cascas de batata, cenoura e chuchu',
'Refogar com temperos.',
20,'FACIL',10,1),

(23,'Bife de Casca de Banana','Substituto vegetal usando casca de banana',
'Cascas de banana, farinha, ovos',
'Empanar e fritar.',
25,'FACIL',12,1),

(24,'Bolinho de Arroz','Aproveitamento de arroz cozido',
'Arroz, ovos, farinha',
'Misturar e fritar bolinhos.',
20,'FACIL',10,1);


INSERT INTO desafio (id_desafio, ativo, titulo, descricao, pontos, duracao_dias, categoria_id_categoria) VALUES
(1, 1,'Composte por 7 dias',
'Separe resíduos orgânicos e utilize uma composteira durante 7 dias consecutivos.',
50,7,2),

(2, 1,'Reduza o desperdício de alimentos',
'Durante uma semana, reaproveite cascas, talos ou sobras de alimentos em receitas.',
40,7,2),

(3, 1,'Separe o lixo corretamente',
'Separe corretamente o lixo orgânico e reciclável durante 5 dias.',
30,5,2),

(4, 1,'Produza menos lixo orgânico',
'Durante 7 dias, tente reduzir a quantidade de resíduos orgânicos gerados em casa.',
35,7,2),

(5, 1,'Faça uma receita sustentável',
'Prepare pelo menos uma receita utilizando reaproveitamento de alimentos.',
20,1,2),

(6, 1,'Construa sua composteira',
'Monte uma composteira doméstica utilizando baldes, caixas ou outro recipiente adequado para iniciar a compostagem de resíduos orgânicos.',
60,3,2);


INSERT INTO recompensa (id_recompensa, ativo, descricao, pontos_necessarios, quantidade_disponivel, parceiro_id_parceiros) VALUES
(1, 1,'5% desconto nas bebidas',150,20,1),
(2, 1,'10% desconto nos chocolates',95,20,1),
(3, 1,'5% desconto nos suéteres',100,20,2),
(4, 0,'10% desconto em medicamentos',200,30,3),
(5, 0,'5% desconto em combustíveis',250,15,4),
(6, 1,'10% desconto em pães e bolos',80,25,5),
(7, 1,'5% desconto em roupas de verão',170,20,6);



