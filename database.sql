-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 16 mars 2026 à 10:55
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `flsh_stats`
--

-- --------------------------------------------------------

--
-- Structure de la table `bacs`
--

CREATE TABLE `bacs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `bacs`
--

INSERT INTO `bacs` (`id`, `code`, `titre`, `created_at`, `updated_at`) VALUES
(1, 'BAC001', 'Science Math', '2026-03-11 12:34:26', '2026-03-11 12:34:26'),
(2, 'BAC002', 'Science', '2026-03-12 13:21:23', '2026-03-12 13:21:23'),
(3, 'BAC003', 'Eco', '2026-03-12 13:21:23', '2026-03-12 13:21:23');

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demandes`
--

CREATE TABLE `demandes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `type_donnees` varchar(255) NOT NULL,
  `niveau_etude` varchar(255) DEFAULT NULL,
  `type_personnel` varchar(255) DEFAULT NULL,
  `priorite` varchar(255) NOT NULL DEFAULT '''medium''',
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `statut` varchar(255) NOT NULL DEFAULT '''pending''',
  `response` text DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `service_file_path` varchar(255) DEFAULT NULL,
  `service_file_name` varchar(255) DEFAULT NULL,
  `request_file_path` varchar(255) DEFAULT NULL,
  `request_file_name` varchar(255) DEFAULT NULL,
  `admin_file_path` varchar(255) DEFAULT NULL,
  `admin_file_name` varchar(255) DEFAULT NULL,
  `final_dataset_path` varchar(255) DEFAULT NULL,
  `final_dataset_name` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `assigned_service` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `demandes`
--

INSERT INTO `demandes` (`id`, `reference`, `type_donnees`, `niveau_etude`, `type_personnel`, `priorite`, `titre`, `description`, `service_id`, `statut`, `response`, `commentaire`, `service_file_path`, `service_file_name`, `request_file_path`, `request_file_name`, `admin_file_path`, `admin_file_name`, `final_dataset_path`, `final_dataset_name`, `user_id`, `assigned_service`, `created_at`, `updated_at`) VALUES
(2, 'REQ-0001', 'Etudiants', 'Licence', NULL, 'moyenne', 'info', 'liste inscription 2023', 4, 'processed', 'voila la liste info', 'voila la liste info', 'demandes/1Qw6zKXwAZfTfVBWnS95ITXQX8lOwjLlJXVGgBJY.pdf', 'etudiants_flsh_sample.pdf', NULL, NULL, NULL, NULL, 'processed_files/demande_2_processed_20260311_125241.csv', 'demande_2_processed_20260311_125241.csv', 2, 4, '2026-03-11 11:49:58', '2026-03-11 12:52:41'),
(3, 'REQ-0002', 'Etudiants', 'Licence', NULL, 'moyenne', 'Traitement auto test', 'Test', 4, 'processed', NULL, NULL, 'demandes/test_processing.csv', 'test_processing.csv', NULL, NULL, NULL, NULL, 'processed_files/demande_3_processed_20260311_124046.csv', 'demande_3_processed_20260311_124046.csv', 2, NULL, '2026-03-11 12:32:38', '2026-03-11 12:40:46'),
(4, 'REQ-0003', 'Etudiants', 'Licence', NULL, 'moyenne', 'Traitement auto test', 'Test', 4, 'processed', NULL, NULL, 'demandes/test_processing.csv', 'test_processing.csv', NULL, NULL, NULL, NULL, 'processed_files/demande_4_processed_20260311_124041.csv', 'demande_4_processed_20260311_124041.csv', 2, NULL, '2026-03-11 12:33:43', '2026-03-11 12:40:41'),
(7, 'REQ-0004', 'Etudiants', 'Licence', NULL, 'moyenne', 'Traitement pdf test', 'Test pdf', 4, 'processed', NULL, NULL, 'demandes/test_processing.pdf', 'test_processing.pdf', NULL, NULL, NULL, NULL, 'processed_files/demande_7_processed_20260311_133059.xlsx', 'demande_7_processed_20260311_133059.xlsx', 2, NULL, '2026-03-11 12:49:21', '2026-03-11 13:30:59'),
(9, 'REQ-0005', 'Etudiants', 'Licence', NULL, 'moyenne', 'Excel export test', 'Test excel export', 4, 'processed', NULL, NULL, 'demandes/test_excel_export.csv', 'test_excel_export.csv', NULL, NULL, NULL, NULL, 'processed_files/demande_9_processed_20260311_133019.xlsx', 'demande_9_processed_20260311_133019.xlsx', 2, NULL, '2026-03-11 13:15:44', '2026-03-11 13:30:19'),
(11, 'REQ-0006', 'Etudiants', 'Licence', NULL, 'moyenne', 'fiche des étudiants', 'inscription', 6, 'envoye_service', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 6, '2026-03-11 21:08:47', '2026-03-11 21:16:49'),
(12, 'REQ-0007', 'Personnel', NULL, 'Autre', 'moyenne', 'hajar', 'darrage', 5, 'envoye_service', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 5, '2026-03-12 11:51:21', '2026-03-12 12:32:13'),
(13, 'REQ-0008', 'Personnel', NULL, 'Administratif', 'moyenne', 'darrage', 'hajar', 4, 'reponse_service', 'voila le personnel', 'voila le personnel', 'demandes/Sm5Kt9rTc2ftOZQhEv75hBLQhrQzao8it0Gt6IJz.pdf', 'etudiants_flsh_sample.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 2, 4, '2026-03-12 12:47:34', '2026-03-12 12:48:54'),
(14, 'REQ-0009', 'Etudiants', 'Licence', NULL, 'moyenne', 'hh', 'dd', 4, 'processed', NULL, NULL, 'demandes/9Ihud9SPiJSR7tVZ7ecEXy7R1uLvSIW4TYbqO2Hi.xlsx', 'template_etudiants_import.xlsx', NULL, NULL, NULL, NULL, 'processed_files/demande_14_processed_20260313_123233.xlsx', 'demande_14_processed_20260313_123233.xlsx', 2, 4, '2026-03-12 12:53:11', '2026-03-13 12:32:33'),
(15, 'REQ-0010', 'Etudiants', 'Licence', NULL, 'moyenne', 'hhg', 'jjj', 4, 'processed', NULL, NULL, 'demandes/8jqvNGXdNn6RLb0sBSFNod5PvwTzh3MIiAPB66mM.xlsx', 'import_etudiants.xlsx', NULL, NULL, NULL, NULL, 'processed_files/demande_15_processed_20260312_132137.xlsx', 'demande_15_processed_20260312_132137.xlsx', 2, 4, '2026-03-12 13:14:33', '2026-03-12 13:21:37');

-- --------------------------------------------------------

--
-- Structure de la table `demande_histories`
--

CREATE TABLE `demande_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `demande_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `demande_histories`
--

INSERT INTO `demande_histories` (`id`, `demande_id`, `user_id`, `action`, `description`, `meta`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 'processed', 'Admin a traite le fichier.', NULL, '2026-03-13 12:32:30', '2026-03-13 12:32:30'),
(2, 14, 1, 'processed', 'Admin a traite le fichier.', NULL, '2026-03-13 12:32:33', '2026-03-13 12:32:33');

-- --------------------------------------------------------

--
-- Structure de la table `demande_records`
--

CREATE TABLE `demande_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `demande_id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `filiere` varchar(255) NOT NULL,
  `niveau` varchar(255) NOT NULL,
  `bac` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `demande_records`
--

INSERT INTO `demande_records` (`id`, `demande_id`, `code`, `nom`, `prenom`, `cin`, `filiere`, `niveau`, `bac`, `province`, `created_at`, `updated_at`) VALUES
(3, 14, 'REQ-2026-001', 'Ahmed', 'Ali', 'AA12345', 'Informatique', 'S3', 'Science', 'Fes', '2026-03-13 12:32:33', '2026-03-13 12:32:33'),
(4, 14, 'REQ-2026-002', 'Sara', 'Benali', 'BB67890', 'Gestion', 'S1', 'Eco', 'Rabat', '2026-03-13 12:32:33', '2026-03-13 12:32:33');

-- --------------------------------------------------------

--
-- Structure de la table `departements`
--

CREATE TABLE `departements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `etablissement_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `departements`
--

INSERT INTO `departements` (`id`, `code`, `nom`, `etablissement_id`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Département par défaut', 1, '2026-03-11 12:33:43', '2026-03-11 12:33:43');

-- --------------------------------------------------------

--
-- Structure de la table `etablissements`
--

CREATE TABLE `etablissements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `etablissements`
--

INSERT INTO `etablissements` (`id`, `nom`, `created_at`, `updated_at`) VALUES
(1, 'Etablissement par défaut', '2026-03-11 12:33:43', '2026-03-11 12:33:43');

-- --------------------------------------------------------

--
-- Structure de la table `etudiants`
--

CREATE TABLE `etudiants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `filiere_id` bigint(20) UNSIGNED NOT NULL,
  `province_id` bigint(20) UNSIGNED NOT NULL,
  `pays_id` bigint(20) UNSIGNED NOT NULL,
  `bac_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `etudiants`
--

INSERT INTO `etudiants` (`id`, `nom`, `prenom`, `filiere_id`, `province_id`, `pays_id`, `bac_id`, `created_at`, `updated_at`) VALUES
(1, 'Ahmed', 'Ali', 1, 1, 1, 2, '2026-03-12 13:21:23', '2026-03-12 13:21:23'),
(2, 'Sara', 'Benali', 2, 4, 1, 3, '2026-03-12 13:21:23', '2026-03-12 13:21:23'),
(3, 'Ahmed', 'Ali', 1, 1, 1, 2, '2026-03-12 13:21:34', '2026-03-12 13:21:34'),
(4, 'Sara', 'Benali', 2, 4, 1, 3, '2026-03-12 13:21:34', '2026-03-12 13:21:34'),
(5, 'Ahmed', 'Ali', 1, 1, 1, 2, '2026-03-12 13:21:35', '2026-03-12 13:21:35'),
(6, 'Sara', 'Benali', 2, 4, 1, 3, '2026-03-12 13:21:35', '2026-03-12 13:21:35'),
(7, 'Ahmed', 'Ali', 1, 1, 1, 2, '2026-03-12 13:21:37', '2026-03-12 13:21:37'),
(8, 'Sara', 'Benali', 2, 4, 1, 3, '2026-03-12 13:21:37', '2026-03-12 13:21:37'),
(9, 'Ahmed', 'Ali', 1, 1, 1, 2, '2026-03-13 12:32:30', '2026-03-13 12:32:30'),
(10, 'Sara', 'Benali', 2, 4, 1, 3, '2026-03-13 12:32:30', '2026-03-13 12:32:30'),
(11, 'Ahmed', 'Ali', 1, 1, 1, 2, '2026-03-13 12:32:33', '2026-03-13 12:32:33'),
(12, 'Sara', 'Benali', 2, 4, 1, 3, '2026-03-13 12:32:33', '2026-03-13 12:32:33');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

CREATE TABLE `filieres` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `departement_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `filieres`
--

INSERT INTO `filieres` (`id`, `code`, `nom`, `departement_id`, `created_at`, `updated_at`) VALUES
(1, 'FIL001', 'Informatique', 1, '2026-03-11 12:33:43', '2026-03-11 12:33:43'),
(2, 'FIL002', 'Gestion', 1, '2026-03-12 13:21:23', '2026-03-12 13:21:23');

-- --------------------------------------------------------

--
-- Structure de la table `grades`
--

CREATE TABLE `grades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `grades`
--

INSERT INTO `grades` (`id`, `code`, `libelle`, `created_at`, `updated_at`) VALUES
(1, 'GRD001', 'Professeur', '2026-03-11 12:34:26', '2026-03-11 12:34:26');

-- --------------------------------------------------------

-- --------------------------------------------------------
--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0000_01_01_000000_create_services_table', 1),
(2, '0001_01_01_000000_create_users_table', 1),
(3, '0001_01_01_000001_create_cache_table', 1),
(4, '0001_01_01_000002_create_jobs_table', 1),
(5, '2026_03_06_234504_create_demandes_table', 1),
(6, '2026_03_08_212606_update_users_table_add_service_type', 1),
(7, '2026_03_08_212609_update_demandes_table_for_workflow', 1),
(8, '2026_03_09_000001_create_provinces_table', 1),
(9, '2026_03_09_000002_create_pays_table', 1),
(10, '2026_03_09_000003_create_bacs_table', 1),
(12, '2026_03_09_000005_create_grades_table', 1),
(13, '2026_03_09_000006_create_types_personnel_table', 1),
(14, '2026_03_09_000007_create_etablissements_table', 1),
(15, '2026_03_09_000008_create_departements_table', 1),
(16, '2026_03_09_000009_create_filieres_table', 1),
(17, '2026_03_09_000010_create_etudiants_table', 1),
(18, '2026_03_09_000011_create_personnels_table', 1),
(19, '2026_03_09_101530_add_priority_to_demandes_table', 1),
(20, '2026_03_09_132833_create_personal_access_tokens_table', 1),
(21, '2026_03_09_195657_rename_status_to_statut_in_demandes_table', 1),
(22, '2026_03_11_110000_extend_demandes_for_full_workflow', 2),
(23, '2026_03_11_114500_make_service_id_nullable_on_demandes_table', 3),
(24, '2026_03_11_121500_add_code_columns_to_reference_tables', 4),
(25, '2026_03_12_120000_add_last_login_at_to_users_table', 5),
(26, '2026_03_12_150000_add_request_and_admin_files_to_demandes_table', 5),
(27, '2026_03_12_150010_create_demande_records_table', 5),
(28, '2026_03_13_090000_add_codes_to_additional_reference_tables', 5),
(29, '2026_03_13_110000_create_demande_histories_table', 5),
(30, '2026_03_13_110010_create_notifications_table', 5),
(31, '2026_03_13_120000_add_reference_to_demandes_table', 5);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pays`
--

CREATE TABLE `pays` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `pays`
--

INSERT INTO `pays` (`id`, `code`, `nom`, `created_at`, `updated_at`) VALUES
(1, 'PAY001', 'Maroc', '2026-03-11 12:34:26', '2026-03-11 12:34:26');

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 15, 'auth_token', '7b2e8d6dcb4e39659acce7ae5a142dbc76d28a2aa2a44762d4153f10f3c47001', '[\"*\"]', NULL, NULL, '2026-03-10 23:53:23', '2026-03-10 23:53:23'),
(2, 'App\\Models\\User', 15, 'auth_token', '8ae646a793a0b21e3e07493dd3a4a5a248de76b2654c56652caf860c3dc6c1fa', '[\"*\"]', NULL, NULL, '2026-03-10 23:54:00', '2026-03-10 23:54:00'),
(3, 'App\\Models\\User', 17, 'auth_token', 'da814d0d85929731661ba92c6be79a08815e7bdf5eb27fae7699ead907071c3f', '[\"*\"]', NULL, NULL, '2026-03-10 23:54:26', '2026-03-10 23:54:26'),
(4, 'App\\Models\\User', 1, 'auth_token', '9a337ed910c05229df995d1d77ba3064009e804f8655f67ac435b3f23b53f673', '[\"*\"]', '2026-03-11 11:37:54', NULL, '2026-03-11 00:05:58', '2026-03-11 11:37:54'),
(5, 'App\\Models\\User', 1, 'auth_token', '5b85521bb876a87ae467f2ec21e63d975be33b49a459d4e06586bb4116e9d086', '[\"*\"]', NULL, NULL, '2026-03-11 11:30:07', '2026-03-11 11:30:07'),
(6, 'App\\Models\\User', 2, 'auth_token', 'd90dfad360047d0aafb817d004baac1abf18f8de42fd510167bd45ee08f73de3', '[\"*\"]', NULL, NULL, '2026-03-11 11:30:08', '2026-03-11 11:30:08'),
(7, 'App\\Models\\User', 32, 'auth_token', '670d214c5fd146b951372f8ad45b0c57802b456e596ed14001fd6630d25fa81d', '[\"*\"]', NULL, NULL, '2026-03-11 11:30:08', '2026-03-11 11:30:08'),
(8, 'App\\Models\\User', 2, 'auth_token', '2e91c3288e5f586e2fead8b502e1470cce52731fe6c52bdc9be52bc2b58e0058', '[\"*\"]', '2026-03-11 11:50:29', NULL, '2026-03-11 11:38:18', '2026-03-11 11:50:29'),
(9, 'App\\Models\\User', 1, 'auth_token', 'c7708a813460aae48b7bc5ca330b68e32620873d413d66dafb0a38ab61672448', '[\"*\"]', '2026-03-11 11:59:22', NULL, '2026-03-11 11:50:55', '2026-03-11 11:59:22'),
(10, 'App\\Models\\User', 3, 'auth_token', 'ffcc955135c44feb388ee38637d69318913ac9a27bc87fd808b571619634536f', '[\"*\"]', NULL, NULL, '2026-03-11 11:55:37', '2026-03-11 11:55:37'),
(11, 'App\\Models\\User', 8, 'auth_token', 'de2162d4011598d881366306dfc09348de842e70760ab3e0c617227b9c080915', '[\"*\"]', NULL, NULL, '2026-03-11 11:55:38', '2026-03-11 11:55:38'),
(12, 'App\\Models\\User', 32, 'auth_token', '83124855ea6f064095f262f10a2279fe1f62c4db58c1f900d4eadb02d6005c1b', '[\"*\"]', NULL, NULL, '2026-03-11 11:55:40', '2026-03-11 11:55:40'),
(13, 'App\\Models\\User', 3, 'auth_token', '2ba3bf14de6bd24cffeddd82bd9625ebef90ba4878d74bf11b88532c304b9a53', '[\"*\"]', '2026-03-11 12:02:13', NULL, '2026-03-11 11:59:38', '2026-03-11 12:02:13'),
(14, 'App\\Models\\User', 3, 'auth_token', '4bbbd3aaa53b0d3674f6bcf4ab35d3b59ec780649a2ecdfa72fabda604686cce', '[\"*\"]', '2026-03-11 12:06:45', NULL, '2026-03-11 12:02:21', '2026-03-11 12:06:45'),
(15, 'App\\Models\\User', 1, 'auth_token', 'ceac5d64a1518f2fe312725ee68c9b4ae4f034af8d6ebcbb0699415d92a3edce', '[\"*\"]', '2026-03-11 13:30:25', NULL, '2026-03-11 12:06:51', '2026-03-11 13:30:25'),
(16, 'App\\Models\\User', 1, 'auth_token', 'e344dc3071a1c6c4189bd3206d2d86f76f6a84bd39ec42cc343c0ef23d268cd5', '[\"*\"]', '2026-03-11 13:30:39', NULL, '2026-03-11 13:30:27', '2026-03-11 13:30:39'),
(17, 'App\\Models\\User', 1, 'auth_token', '5c12f1949d05fdcd439a7df91be995afa7f6971d5d90c57334400c7cc79fc348', '[\"*\"]', '2026-03-11 20:54:46', NULL, '2026-03-11 13:30:44', '2026-03-11 20:54:46'),
(18, 'App\\Models\\User', 1, 'auth_token', '542ddf837ffd621e0335d7d9634f21967cc7fee76898ee4be348c85a121565ce', '[\"*\"]', '2026-03-11 21:07:46', NULL, '2026-03-11 20:55:05', '2026-03-11 21:07:46'),
(25, 'App\\Models\\User', 1, 'auth_token', '0284d980e68b404d09aa1142ade8568c31b470cfe961c9924ebb23bf77332899', '[\"*\"]', '2026-03-12 11:54:27', NULL, '2026-03-12 11:54:18', '2026-03-12 11:54:27'),
(43, 'App\\Models\\User', 1, 'auth_token', '9cef68bf9447a306989c8052be396febbe6379d0fded7b8bc44253b83ec0fa41', '[\"*\"]', '2026-03-16 09:54:43', NULL, '2026-03-13 12:29:57', '2026-03-16 09:54:43');

-- --------------------------------------------------------

--
-- Structure de la table `personnels`
--

CREATE TABLE `personnels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `departement_id` bigint(20) UNSIGNED NOT NULL,
  `grade_id` bigint(20) UNSIGNED NOT NULL,
  `type_personnel_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `provinces`
--

CREATE TABLE `provinces` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `provinces`
--

INSERT INTO `provinces` (`id`, `code`, `nom`, `created_at`, `updated_at`) VALUES
(1, 'PR001', 'Fes', '2026-03-11 12:34:26', '2026-03-11 12:34:26'),
(3, 'PR002', 'F?s', '2026-03-11 13:19:35', '2026-03-11 13:19:35'),
(4, 'PR003', 'Rabat', '2026-03-12 13:21:23', '2026-03-12 13:21:23');

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `code`, `name`, `description`, `created_at`, `updated_at`) VALUES
(2, NULL, 'Pedagogique', 'Service Pédagogique', '2026-03-10 12:59:17', '2026-03-10 12:59:17'),
(4, NULL, 'Service RH', 'Ressources Humaines', '2026-03-11 11:29:37', '2026-03-11 11:29:37'),
(5, NULL, 'Service Éducatif', 'Service Éducatif', '2026-03-11 11:29:37', '2026-03-11 11:29:37'),
(6, NULL, 'Service Scolarité', 'Service Scolarité', '2026-03-11 11:29:37', '2026-03-11 11:29:37'),
(7, NULL, 'Service Statistiques', 'Service Statistiques', '2026-03-11 11:29:37', '2026-03-11 11:29:37'),
(8, NULL, 'Service Informatique', 'Service Informatique', '2026-03-11 11:29:37', '2026-03-11 11:29:37');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('fQ3Oa5Xe6t34tow5VppJUvXsvsqIFePGfQTR8bBI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUh1N3pTcjIwdG5IOVNVWWxYcGtBN0tXUGZSM255VWpSZ3doOXVlMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773316539);

-- --------------------------------------------------------

--
-- Structure de la table `types_personnel`
--

CREATE TABLE `types_personnel` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `libelle` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'student',
  `service_type` varchar(255) DEFAULT NULL,
  `service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `last_login_at`, `password`, `role`, `service_type`, `service_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@gmail.com', NULL, '2026-03-13 12:29:57', '$2y$12$tyCXtjZd3gTGc95VY0h75.gGF7Tcx1jP7Ewd2AFEq2chOuwzSOC5G', 'admin', NULL, NULL, NULL, '2026-03-10 12:59:18', '2026-03-13 12:29:57'),
(2, 'President', 'president@gmail.com', NULL, NULL, '$2y$12$XE/WBFnmoDwQ.Td5rCditO/EuColyuqV7ZomauOxs.bPleoI4e67S', 'president', NULL, NULL, NULL, '2026-03-10 13:11:03', '2026-03-11 21:25:02'),
(3, 'Responsable RH', 'rh@gmail.com', NULL, NULL, '$2y$12$ug7/2nCwvhLyLOPdwhZdU.to0/uUcph7T6t/bBJlv8q9pB4Qs3OA2', 'service', 'Service RH', 4, NULL, '2026-03-10 13:11:03', '2026-03-11 21:25:03'),
(4, 'Test User', 'test@example.com', NULL, NULL, 'password_hash', 'admin', NULL, NULL, NULL, '2026-03-10 13:13:11', '2026-03-10 13:13:11'),
(8, 'Responsable Pedagogique', 'pedagogique@gmail.com', NULL, NULL, '$2y$12$hX3L6e/byIuFD2U6ZkoH4.zJiW9Tar8.ahLJUPR0zYqyrBggb9WFS', 'service', 'Pedagogique', 2, NULL, '2026-03-10 13:14:47', '2026-03-11 11:55:07'),
(9, 'Responsable Statistiques', 'statistique@gmail.com', NULL, NULL, '$2y$12$pigkDWW4cvY1oO/NYELUbOkxdfM3qj7iOzKz17TDfC0gt/RhGqQfm', 'service', 'Service Statistiques', 7, NULL, '2026-03-10 13:14:47', '2026-03-11 21:25:05'),
(15, 'Admin FLSH', 'admin@flsh.com', NULL, NULL, '$2y$10$5xHLASOiH4L6xFf7M.cczujeQtMKTSRsqXiXT5C7zDDZxWaljO5Fu', 'admin', NULL, NULL, NULL, '2026-03-10 23:51:13', '2026-03-11 00:05:23'),
(16, 'President FLSH', 'president@flsh.com', NULL, NULL, '$2y$10$pZUNQ6lcUS66WE2eeqbWD.v98P8pAtsKTf0JUJ/d..0vS1Uz/cmyO', 'president', NULL, NULL, NULL, '2026-03-10 23:51:13', '2026-03-11 00:05:23'),
(17, 'Responsable RH', 'rh@flsh.com', NULL, NULL, '$2y$12$uJGF/JRYQ9VfNvc0UATzMuFpKFgD9y4EIfbedMrpba23IIzli0ybS', 'service', 'Service RH', 4, NULL, '2026-03-10 23:51:13', '2026-03-11 11:55:08'),
(18, 'Responsable Pedagogique', 'pedagogique@flsh.com', NULL, NULL, '$2y$12$IhkDCoKUfjoiLO.T8J7Rh.dQY/Tm9Ihal9HSS8Zj1uwbyAPOQbEPi', 'service', 'Pedagogique', 2, NULL, '2026-03-10 23:51:13', '2026-03-11 11:55:08'),
(19, 'Responsable Statistique', 'statistique@flsh.com', NULL, NULL, '$2y$12$dvL4AqVhdu/a8evFF86TluyLfFyx.texfUY2bgjXXEQBOtLE6sG9u', 'service', 'Service Statistiques', 7, NULL, '2026-03-10 23:51:13', '2026-03-11 11:55:09'),
(32, 'Service', 'service@gmail.com', NULL, NULL, '$2y$12$vW4wLk1uMGyyryhtfTJ02ODADgD9GXtt9I1zo8VoHGh0cEf21WCca', 'service', 'Service RH', 4, NULL, '2026-03-11 11:29:40', '2026-03-11 21:25:03'),
(33, 'Responsable Éducatif', 'educatif@gmail.com', NULL, NULL, '$2y$10$EIXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.ogB6d7Jp2dF0k9y.', 'service', 'Service Éducatif', 5, NULL, '2026-03-11 11:29:41', '2026-03-11 21:25:04'),
(34, 'Responsable Scolarité', 'scolarite@gmail.com', NULL, NULL, '$2y$12$H1o3mrBc6i0EilWvUX6NMOvhkJa3e6ATJNgmujOTegWtCRnBzhfRW', 'service', 'Service Scolarité', 6, NULL, '2026-03-11 11:29:42', '2026-03-11 21:25:04'),
(35, 'Responsable Informatique', 'informatique@gmail.com', NULL, NULL, '$2y$12$3BghOGvPE8UfCFs/6ejvnOMV3R/ysUcBz1C13fI5tDP15L1h2Sd0u', 'service', 'Service Informatique', 8, NULL, '2026-03-11 11:29:44', '2026-03-11 21:25:05');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bacs`
--
ALTER TABLE `bacs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bacs_titre_unique` (`titre`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Index pour la table `demandes`
--
ALTER TABLE `demandes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `demandes_reference_unique` (`reference`),
  ADD KEY `demandes_user_id_foreign` (`user_id`),
  ADD KEY `demandes_assigned_service_foreign` (`assigned_service`),
  ADD KEY `demandes_service_id_foreign` (`service_id`);

--
-- Index pour la table `demande_histories`
--
ALTER TABLE `demande_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demande_histories_demande_id_foreign` (`demande_id`),
  ADD KEY `demande_histories_user_id_foreign` (`user_id`);

--
-- Index pour la table `demande_records`
--
ALTER TABLE `demande_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demande_records_demande_id_code_index` (`demande_id`,`code`);

--
-- Index pour la table `departements`
--
ALTER TABLE `departements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departements_etablissement_id_foreign` (`etablissement_id`);

--
-- Index pour la table `etablissements`
--
ALTER TABLE `etablissements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `etablissements_nom_unique` (`nom`);

--
-- Index pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `etudiants_filiere_id_foreign` (`filiere_id`),
  ADD KEY `etudiants_province_id_foreign` (`province_id`),
  ADD KEY `etudiants_pays_id_foreign` (`pays_id`),
  ADD KEY `etudiants_bac_id_foreign` (`bac_id`),

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `filieres_departement_id_foreign` (`departement_id`);

--
-- Index pour la table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `grades_libelle_unique` (`libelle`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `pays`
--
ALTER TABLE `pays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pays_nom_unique` (`nom`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `personnels`
--
ALTER TABLE `personnels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `personnels_departement_id_foreign` (`departement_id`),
  ADD KEY `personnels_grade_id_foreign` (`grade_id`),
  ADD KEY `personnels_type_personnel_id_foreign` (`type_personnel_id`);

--
-- Index pour la table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `provinces_nom_unique` (`nom`);

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `types_personnel`
--
ALTER TABLE `types_personnel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `types_personnel_libelle_unique` (`libelle`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_service_id_foreign` (`service_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bacs`
--
ALTER TABLE `bacs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `demandes`
--
ALTER TABLE `demandes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `demande_histories`
--
ALTER TABLE `demande_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `demande_records`
--
ALTER TABLE `demande_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `departements`
--
ALTER TABLE `departements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `etablissements`
--
ALTER TABLE `etablissements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `etudiants`
--
ALTER TABLE `etudiants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `filieres`
--
ALTER TABLE `filieres`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pays`
--
ALTER TABLE `pays`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT pour la table `personnels`
--
ALTER TABLE `personnels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `types_personnel`
--
ALTER TABLE `types_personnel`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `demandes`
--
ALTER TABLE `demandes`
  ADD CONSTRAINT `demandes_assigned_service_foreign` FOREIGN KEY (`assigned_service`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `demandes_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `demandes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `demande_histories`
--
ALTER TABLE `demande_histories`
  ADD CONSTRAINT `demande_histories_demande_id_foreign` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `demande_histories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `demande_records`
--
ALTER TABLE `demande_records`
  ADD CONSTRAINT `demande_records_demande_id_foreign` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `departements`
--
ALTER TABLE `departements`
  ADD CONSTRAINT `departements_etablissement_id_foreign` FOREIGN KEY (`etablissement_id`) REFERENCES `etablissements` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `etudiants_bac_id_foreign` FOREIGN KEY (`bac_id`) REFERENCES `bacs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `etudiants_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `etudiants_pays_id_foreign` FOREIGN KEY (`pays_id`) REFERENCES `pays` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `etudiants_province_id_foreign` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `filieres`
--
ALTER TABLE `filieres`
  ADD CONSTRAINT `filieres_departement_id_foreign` FOREIGN KEY (`departement_id`) REFERENCES `departements` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `personnels`
--
ALTER TABLE `personnels`
  ADD CONSTRAINT `personnels_departement_id_foreign` FOREIGN KEY (`departement_id`) REFERENCES `departements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `personnels_grade_id_foreign` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `personnels_type_personnel_id_foreign` FOREIGN KEY (`type_personnel_id`) REFERENCES `types_personnel` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
