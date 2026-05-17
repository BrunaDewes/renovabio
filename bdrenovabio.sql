-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bdrenovabio
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acao_usuario`
--

DROP TABLE IF EXISTS `acao_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acao_usuario` (
  `id_acao_usuario` bigint NOT NULL AUTO_INCREMENT,
  `comprovante` varchar(100) DEFAULT NULL,
  `data_acao` datetime(6) DEFAULT NULL,
  `id_referencia` bigint DEFAULT NULL,
  `pontos_gerados` int DEFAULT NULL,
  `tipo_acao` enum('COMPOSTAGEM','DESAFIO','OUTROS','RECEITA') DEFAULT NULL,
  `usuario_id_usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`id_acao_usuario`),
  KEY `FK1qcxvonjaa08n95hdgkga91lk` (`usuario_id_usuario`),
  CONSTRAINT `FK1qcxvonjaa08n95hdgkga91lk` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acao_usuario`
--

LOCK TABLES `acao_usuario` WRITE;
/*!40000 ALTER TABLE `acao_usuario` DISABLE KEYS */;
INSERT INTO `acao_usuario` VALUES (1,NULL,'2026-03-16 01:35:13.039030',1,10,'RECEITA',3),(2,NULL,'2026-03-21 21:41:09.231232',1,10,'RECEITA',3),(3,NULL,'2026-03-27 03:37:10.828475',1,10,'RECEITA',3),(4,NULL,'2026-03-27 03:37:10.949599',1,10,'RECEITA',3),(5,NULL,'2026-03-27 03:37:10.810970',1,10,'RECEITA',3),(6,NULL,'2026-03-27 03:37:10.805458',1,10,'RECEITA',3),(7,NULL,'2026-03-27 03:37:10.828475',1,10,'RECEITA',3),(8,NULL,'2026-03-27 03:37:13.111335',3,10,'RECEITA',3),(9,NULL,'2026-03-27 03:37:13.141260',1,10,'RECEITA',3),(10,NULL,'2026-04-07 01:41:41.056667',23,12,'RECEITA',3),(11,NULL,'2026-04-07 01:57:39.877483',6,12,'RECEITA',3),(12,NULL,'2026-04-07 02:33:05.809289',1,10,'RECEITA',3),(13,NULL,'2026-04-07 02:33:11.889715',2,10,'RECEITA',3),(14,NULL,'2026-04-07 02:33:14.015267',2,10,'RECEITA',3),(15,NULL,'2026-04-07 02:33:16.937976',2,10,'RECEITA',3),(16,NULL,'2026-04-07 02:33:19.008007',2,10,'RECEITA',3),(17,NULL,'2026-04-07 02:33:20.645720',2,10,'RECEITA',3),(18,NULL,'2026-04-07 02:33:22.371205',2,10,'RECEITA',3),(19,NULL,'2026-04-07 02:33:24.247955',2,10,'RECEITA',3),(20,NULL,'2026-04-07 02:37:13.216004',1,10,'RECEITA',3),(21,NULL,'2026-04-07 02:37:20.155443',4,12,'RECEITA',3),(22,NULL,'2026-04-07 02:37:21.989624',4,12,'RECEITA',3),(23,NULL,'2026-04-07 02:37:23.685691',4,12,'RECEITA',3),(24,NULL,'2026-04-07 02:37:25.208497',4,12,'RECEITA',3),(25,NULL,'2026-04-07 02:37:26.623469',4,12,'RECEITA',3),(26,NULL,'2026-04-07 02:37:27.975249',4,12,'RECEITA',3),(27,NULL,'2026-04-12 14:24:09.199330',17,15,'RECEITA',3),(28,NULL,'2026-04-21 17:47:21.372557',1,10,'RECEITA',3),(29,NULL,'2026-04-21 17:47:23.184031',1,10,'RECEITA',3),(30,NULL,'2026-04-21 17:47:24.514912',1,10,'RECEITA',3),(31,NULL,'2026-04-21 17:47:25.809462',1,10,'RECEITA',3),(32,NULL,'2026-04-21 17:47:39.875318',4,12,'RECEITA',3),(33,NULL,'2026-04-21 17:47:41.597887',4,12,'RECEITA',3),(34,NULL,'2026-04-21 17:47:43.184619',4,12,'RECEITA',3),(35,NULL,'2026-04-21 18:06:15.040276',6,12,'RECEITA',3),(36,NULL,'2026-04-21 18:06:17.054998',6,12,'RECEITA',3),(37,NULL,'2026-04-21 18:06:18.605996',6,12,'RECEITA',3),(38,NULL,'2026-04-21 18:06:20.359241',6,12,'RECEITA',3),(39,NULL,'2026-04-21 18:06:21.522434',6,12,'RECEITA',3),(40,NULL,'2026-04-21 18:06:22.537641',6,12,'RECEITA',3),(41,NULL,'2026-04-21 18:06:23.710643',6,12,'RECEITA',3),(42,NULL,'2026-04-21 18:06:24.821787',6,12,'RECEITA',3),(43,NULL,'2026-04-21 18:06:25.932800',6,12,'RECEITA',3),(44,NULL,'2026-04-21 18:06:27.038302',6,12,'RECEITA',3),(45,NULL,'2026-04-21 18:06:28.426276',6,12,'RECEITA',3);
/*!40000 ALTER TABLE `acao_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` bigint NOT NULL AUTO_INCREMENT,
  `nome_categoria` varchar(45) NOT NULL,
  `tipo` enum('DESAFIO','RECEITA') DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Doces','RECEITA'),(2,'Reaproveitamento','RECEITA'),(3,'Compostagem','DESAFIO'),(4,'Redução de resíduos','DESAFIO'),(5,'Reciclagem','DESAFIO'),(6,'Salgados','RECEITA'),(7,'Bebidas','RECEITA');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cidade`
--

DROP TABLE IF EXISTS `cidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cidade` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cidade`
--

LOCK TABLES `cidade` WRITE;
/*!40000 ALTER TABLE `cidade` DISABLE KEYS */;
INSERT INTO `cidade` VALUES (1,'RS','Caibaté'),(2,'RS','São Luiz Gonzaga'),(3,'RS','Santo Ângelo'),(4,'RS','Bossoroca'),(5,'RS','Cerro Largo'),(6,'RS','Dezesseis de Novembro'),(7,'RS','Entre-Ijuís'),(8,'RS','Eugênio de Castro'),(9,'RS','Garruchos'),(10,'RS','Giruá'),(11,'RS','Guarani das Missões'),(12,'RS','Mato Queimado'),(13,'RS','Pirapó'),(14,'RS','Porto Xavier'),(15,'RS','Rolador'),(16,'RS','Roque Gonzales'),(17,'RS','Salvador das Missões'),(18,'RS','Santo Antônio das Missões'),(19,'RS','São Borja'),(20,'RS','São Miguel das Missões'),(21,'RS','São Paulo das Missões'),(22,'RS','São Nicolau'),(23,'RS','São Pedro do Butiá'),(24,'RS','Sete de Setembro'),(25,'RS','Ubiretama'),(26,'RS','Vitória das Missões');
/*!40000 ALTER TABLE `cidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprovacao_desafio`
--

DROP TABLE IF EXISTS `comprovacao_desafio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprovacao_desafio` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_envio` datetime(6) DEFAULT NULL,
  `imagem_url` varchar(255) NOT NULL,
  `usuario_desafio_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6wig5e1bkugx7h48xbmxqgb2i` (`usuario_desafio_id`),
  CONSTRAINT `FK6wig5e1bkugx7h48xbmxqgb2i` FOREIGN KEY (`usuario_desafio_id`) REFERENCES `usuario_has_desafio` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprovacao_desafio`
--

LOCK TABLES `comprovacao_desafio` WRITE;
/*!40000 ALTER TABLE `comprovacao_desafio` DISABLE KEYS */;
INSERT INTO `comprovacao_desafio` VALUES (1,'2026-04-21 17:46:31.001825','/uploads/comprovacoes/d7d59070-f2dd-487a-910c-1d50652f31d1.jpeg',7);
/*!40000 ALTER TABLE `comprovacao_desafio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desafio`
--

DROP TABLE IF EXISTS `desafio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `desafio` (
  `id_desafio` bigint NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) DEFAULT NULL,
  `descricao` text,
  `duracao_dias` int DEFAULT NULL,
  `pontos` int DEFAULT NULL,
  `titulo` varchar(45) NOT NULL,
  `categoria_id_categoria` bigint DEFAULT NULL,
  PRIMARY KEY (`id_desafio`),
  KEY `FK6j3n5v2p6yajv7s12qv91jl14` (`categoria_id_categoria`),
  CONSTRAINT `FK6j3n5v2p6yajv7s12qv91jl14` FOREIGN KEY (`categoria_id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desafio`
--

LOCK TABLES `desafio` WRITE;
/*!40000 ALTER TABLE `desafio` DISABLE KEYS */;
INSERT INTO `desafio` VALUES (1,_binary '','Separe resíduos orgânicos e utilize uma composteira durante 7 dias consecutivos.',7,50,'Composte por 7 dias',2),(2,_binary '','Durante uma semana, reaproveite cascas, talos ou sobras de alimentos em receitas.',7,40,'Reduza o desperdício de alimentos',2),(3,_binary '','Separe corretamente o lixo orgânico e reciclável durante 5 dias.',5,30,'Separe o lixo corretamente',2),(4,_binary '','Durante 7 dias, tente reduzir a quantidade de resíduos orgânicos gerados em casa.',7,35,'Produza menos lixo orgânico',2),(5,_binary '','Prepare pelo menos uma receita utilizando reaproveitamento de alimentos.',1,20,'Faça uma receita sustentável',2),(6,_binary '','Monte uma composteira doméstica utilizando baldes, caixas ou outro recipiente adequado para iniciar a compostagem de resíduos orgânicos.',3,60,'Construa sua composteira',2);
/*!40000 ALTER TABLE `desafio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id_feedback` bigint NOT NULL AUTO_INCREMENT,
  `data_envio` datetime(6) DEFAULT NULL,
  `mensagem` mediumtext NOT NULL,
  `usuario_id_usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`id_feedback`),
  KEY `FKkgwh29pqy3o910sfqy3oiu84p` (`usuario_id_usuario`),
  CONSTRAINT `FKkgwh29pqy3o910sfqy3oiu84p` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'2026-03-27 02:05:26.185621','Gostei do app',3),(2,'2026-04-13 01:48:31.247715','Adorei!!',3),(3,'2026-04-21 20:59:49.396933','Adoro',3);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico_pontuacao`
--

DROP TABLE IF EXISTS `historico_pontuacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_pontuacao` (
  `id_historico_pontuacao` bigint NOT NULL AUTO_INCREMENT,
  `data_registro` datetime(6) DEFAULT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  `tipo_pontuacao` enum('GANHO','GASTO') DEFAULT NULL,
  `usuario_id_usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`id_historico_pontuacao`),
  KEY `FKmxgpfcs4yqestk83ch93uiukn` (`usuario_id_usuario`),
  CONSTRAINT `FKmxgpfcs4yqestk83ch93uiukn` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_pontuacao`
--

LOCK TABLES `historico_pontuacao` WRITE;
/*!40000 ALTER TABLE `historico_pontuacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `historico_pontuacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parceiro`
--

DROP TABLE IF EXISTS `parceiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parceiro` (
  `id_parceiros` bigint NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) DEFAULT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `nome_parceiro` varchar(45) NOT NULL,
  `cidade_id_cidade` bigint DEFAULT NULL,
  PRIMARY KEY (`id_parceiros`),
  KEY `FKlqhb7c37q25k7ewi15f28py79` (`cidade_id_cidade`),
  CONSTRAINT `FKlqhb7c37q25k7ewi15f28py79` FOREIGN KEY (`cidade_id_cidade`) REFERENCES `cidade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parceiro`
--

LOCK TABLES `parceiro` WRITE;
/*!40000 ALTER TABLE `parceiro` DISABLE KEYS */;
INSERT INTO `parceiro` VALUES (1,_binary '','Descontos em produtos','Supermercado Laçador',1),(2,_binary '','Descontos em produtos','SB Malhas',1),(3,_binary '\0','Descontos em produtos','Farmácia São João',3),(4,_binary '','Descontos em combustíveis','Posto Ipiranga',12),(5,_binary '','Descontos em produtos','Padaria Both',1),(6,_binary '','Descontos em produtos','Loja da Economia',20);
/*!40000 ALTER TABLE `parceiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receita`
--

DROP TABLE IF EXISTS `receita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receita` (
  `id_receita` bigint NOT NULL AUTO_INCREMENT,
  `descricao` varchar(500) DEFAULT NULL,
  `dificuldade` enum('DIFICIL','FACIL','MEDIA') DEFAULT NULL,
  `ingredientes` mediumtext NOT NULL,
  `modo_preparo` longtext NOT NULL,
  `pontos` int DEFAULT NULL,
  `tempo_preparo` int DEFAULT NULL,
  `titulo_receita` varchar(45) NOT NULL,
  `categoria_id_categoria` bigint DEFAULT NULL,
  PRIMARY KEY (`id_receita`),
  KEY `FKb238kovvgpbwilqgo8qqcl8gd` (`categoria_id_categoria`),
  CONSTRAINT `FKb238kovvgpbwilqgo8qqcl8gd` FOREIGN KEY (`categoria_id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receita`
--

LOCK TABLES `receita` WRITE;
/*!40000 ALTER TABLE `receita` DISABLE KEYS */;
INSERT INTO `receita` VALUES (1,'Reaproveitamento de casca','FACIL','Cascas de banana, farinha','Misturar e assar',10,40,'Bolo de Casca de Banana',1),(2,'Reaproveitamento de arroz','FACIL','Arroz cozido, temperos','Refogar ingredientes',10,25,'Arroz de Sobras',1),(3,'Reaproveitamento da casca da laranja','FACIL','Laranja com casca, ovos, açúcar, óleo, farinha, fermento','Bater os ingredientes líquidos no liquidificador, misturar com farinha e fermento e assar.',10,40,'Bolo de Laranja com Casca',1),(4,'Aproveitamento de cascas de frutas','MEDIA','Suco de laranja, maca com casca, aveia, ovos, farinha, acucar mascavo','Misturar ingredientes secos, adicionar liquidos e assar.',12,40,'Bolo de Laranja com Casca de Maca e Aveia',1),(5,'Aproveitamento de frutas maduras','FACIL','Manga, suco de laranja, sal','Cozinhar a manga com suco ate reduzir e atingir consistencia de geleia.',10,30,'Geleia de Manga Sem Acucar',1),(6,'Reaproveitamento da casca do mamao','MEDIA','Cascas de mamao, acucar','Cozinhar as cascas, bater e levar ao fogo ate dar ponto.',12,45,'Doce de Casca de Mamao',1),(7,'Reaproveitamento da casca do abacaxi','FACIL','Ovos, farinha, acucar, caldo da casca de abacaxi','Preparar massa com o caldo da casca e assar.',10,40,'Bolo de Casca de Abacaxi',1),(8,'Aproveitamento da casca de laranja','MEDIA','Cascas de laranja, acucar, agua','Cozinhar as cascas e finalizar em calda de acucar.',12,35,'Casca de Laranja Cristalizada',1),(9,'Reaproveitamento da casca de abacaxi','MEDIA','Suco da casca de abacaxi, coco ralado, acucar, gemas','Cozinhar todos os ingredientes até formar massa consistente.',12,30,'Docinho de Abacaxi com Coco',1),(10,'Reaproveitamento da entrecasca da melancia','MEDIA','Entrecasca de melancia, coco, acucar','Cozinhar ate obter consistencia de cocada.',12,35,'Cocada de Entrecasca de Melancia',1),(11,'Uso do suco da casca de abacaxi na massa','MEDIA','Fermento, acucar, ovos, suco de casca de abacaxi, farinha','Preparar massa, deixar crescer e assar.',15,60,'Pao Doce de Abacaxi',1),(12,'Aproveitamento de talos de verduras','FACIL','Arroz, talos de salsa e couve, alho','Refogar os talos com arroz e cozinhar.',10,25,'Arroz de Talos',1),(13,'Reaproveitamento de casca de abobora','FACIL','Cascas de abobora, arroz cozido, creme de leite','Cozinhar as cascas e misturar com arroz e creme.',10,30,'Arroz de Casca de Abobora',1),(14,'Snack sustentavel','FACIL','Cascas de cenoura, batata, sementes de abobora, azeite','Temperar e assar até dourar.',10,20,'Chips de Cascas e Sementes',1),(15,'Reaproveitamento da casca da melancia','FACIL','Cascas de melancia, farinha de mandioca, alho','Refogar e misturar com farinha.',10,20,'Farofa de Casca de Melancia',1),(16,'Uso integral de folhas e talos','MEDIA','Folhas e talos variados, farinha, fermento','Bater ingredientes, preparar massa e assar.',15,50,'Pao de Folhas e Talos',1),(17,'Uso de sementes e polpa da abobora','MEDIA','Farinha, abobora, sementes, fermento','Preparar massa e assar.',15,45,'Pao de Abobora com Sementes',1),(18,'Reaproveitamento da casca da batata','FACIL','Cascas de batata, ovos, farinha','Preparar massa e fritar bolinhos.',10,25,'Bolinho de Casca de Batata',1),(19,'Aproveitamento integral de vegetais','FACIL','Folhas, talos, ovos, farinha','Refogar folhas, misturar com massa e fritar.',10,25,'Bolinho de Folhas e Talos',1),(20,'Uso das folhas da couve-flor','FACIL','Folhas de couve-flor, azeite, queijo','Refogar folhas e gratinar no forno.',10,25,'Gratinado de Folhas de Couve-Flor',1),(21,'Sopa nutritiva com reaproveitamento','FACIL','Talos, cascas de legumes, cebola, alho','Cozinhar ingredientes e bater ate formar sopa.',12,35,'Sopa de Talos e Cascas',1),(22,'Reaproveitamento de cascas variadas','FACIL','Cascas de batata, cenoura e chuchu','Refogar com temperos.',10,20,'Refogado de Cascas de Legumes',1),(23,'Substituto vegetal usando casca de banana','FACIL','Cascas de banana, farinha, ovos','Empanar e fritar.',12,25,'Bife de Casca de Banana',1),(24,'Aproveitamento de arroz cozido','FACIL','Arroz, ovos, farinha','Misturar e fritar bolinhos.',10,20,'Bolinho de Arroz',1);
/*!40000 ALTER TABLE `receita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recompensa`
--

DROP TABLE IF EXISTS `recompensa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recompensa` (
  `id_recompensa` bigint NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) DEFAULT NULL,
  `descricao` varchar(200) NOT NULL,
  `pontos_necessarios` int DEFAULT NULL,
  `quantidade_disponivel` int DEFAULT NULL,
  `parceiro_id_parceiros` bigint DEFAULT NULL,
  PRIMARY KEY (`id_recompensa`),
  KEY `FKaqwek7aqnjka5m5no20pva4ec` (`parceiro_id_parceiros`),
  CONSTRAINT `FKaqwek7aqnjka5m5no20pva4ec` FOREIGN KEY (`parceiro_id_parceiros`) REFERENCES `parceiro` (`id_parceiros`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recompensa`
--

LOCK TABLES `recompensa` WRITE;
/*!40000 ALTER TABLE `recompensa` DISABLE KEYS */;
INSERT INTO `recompensa` VALUES (1,_binary '','5% desconto nas bebidas',150,20,1),(2,_binary '','10% desconto nos chocolates',95,20,1),(3,_binary '','5% desconto nos suéteres',100,19,2),(4,_binary '\0','10% desconto em medicamentos',200,30,3),(5,_binary '\0','5% desconto em combustíveis',250,15,4),(6,_binary '','10% desconto em pães e bolos',80,24,5),(7,_binary '','5% desconto em roupas de verão',170,20,6);
/*!40000 ALTER TABLE `recompensa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `troca_recompensa`
--

DROP TABLE IF EXISTS `troca_recompensa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `troca_recompensa` (
  `id_troca_recompensa` bigint NOT NULL AUTO_INCREMENT,
  `codigo_voucher` varchar(45) DEFAULT NULL,
  `data_troca` datetime(6) DEFAULT NULL,
  `status` enum('CANCELADO','PENDENTE','RESGATADO') DEFAULT NULL,
  `recompensa_id_recompensas` bigint DEFAULT NULL,
  `usuario_id_usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`id_troca_recompensa`),
  KEY `FKg3kcsani6byjtwjn8ohjikil5` (`recompensa_id_recompensas`),
  KEY `FKt634qa8t0c9sl0hguy8fdblam` (`usuario_id_usuario`),
  CONSTRAINT `FKg3kcsani6byjtwjn8ohjikil5` FOREIGN KEY (`recompensa_id_recompensas`) REFERENCES `recompensa` (`id_recompensa`),
  CONSTRAINT `FKt634qa8t0c9sl0hguy8fdblam` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `troca_recompensa`
--

LOCK TABLES `troca_recompensa` WRITE;
/*!40000 ALTER TABLE `troca_recompensa` DISABLE KEYS */;
INSERT INTO `troca_recompensa` VALUES (1,'51747edd','2026-03-23 00:27:52.557807','RESGATADO',6,3),(2,'70502112','2026-04-21 18:06:38.781625','RESGATADO',3,3);
/*!40000 ALTER TABLE `troca_recompensa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) DEFAULT NULL,
  `data_cadastro` datetime(6) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `pontuacao_atual` int DEFAULT NULL,
  `senha` varchar(100) NOT NULL,
  `tipo` enum('CIDADAO','PREFEITURA') DEFAULT NULL,
  `cidade_id_cidade` bigint DEFAULT NULL,
  `foto_perfil_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `FKe0k0l5aycn0rvya7ijd4ha7hk` (`cidade_id_cidade`),
  CONSTRAINT `FKe0k0l5aycn0rvya7ijd4ha7hk` FOREIGN KEY (`cidade_id_cidade`) REFERENCES `cidade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (3,_binary '','2026-03-16 01:31:35.350252','brunalunkesd@gmail.com','Bruna Lunkes',34,'$2a$10$WgtjVvueutaqFD.ga5tdQOZ0UdjmEIj0KnHixm9X74XnJqIWEQz7C',NULL,1,'/uploads/perfil/4ec268a2-6c65-4c79-ac5a-b8b0d4fc99be.jpeg'),(4,_binary '','2026-03-29 22:24:27.691980','maria@gmail.com','Maria',0,'Maria123',NULL,25,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_has_desafio`
--

DROP TABLE IF EXISTS `usuario_has_desafio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_has_desafio` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id_usuario` bigint NOT NULL,
  `desafio_id_desafio` bigint NOT NULL,
  `progresso` int DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `status` enum('EM_ANDAMENTO','CONCLUIDO','ABANDONADO') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_desafio_usuario` (`usuario_id_usuario`),
  KEY `fk_usuario_desafio_desafio` (`desafio_id_desafio`),
  CONSTRAINT `fk_usuario_desafio_desafio` FOREIGN KEY (`desafio_id_desafio`) REFERENCES `desafio` (`id_desafio`),
  CONSTRAINT `fk_usuario_desafio_usuario` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_has_desafio`
--

LOCK TABLES `usuario_has_desafio` WRITE;
/*!40000 ALTER TABLE `usuario_has_desafio` DISABLE KEYS */;
INSERT INTO `usuario_has_desafio` VALUES (1,3,1,100,'2026-03-21',NULL,'CONCLUIDO'),(7,3,2,43,'2026-04-06',NULL,'EM_ANDAMENTO'),(8,3,3,20,'2026-04-06',NULL,'EM_ANDAMENTO'),(9,3,4,0,'2026-04-21',NULL,'EM_ANDAMENTO'),(10,3,5,0,'2026-04-21',NULL,'EM_ANDAMENTO');
/*!40000 ALTER TABLE `usuario_has_desafio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09 17:17:56
