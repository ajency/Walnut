-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 08, 2014 at 06:50 AM
-- Server version: 5.1.44
-- PHP Version: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `walnut`
--

-- --------------------------------------------------------

--
-- Table structure for table `wp_training_logs`
--

CREATE TABLE IF NOT EXISTS `wp_training_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `division_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=45 ;

--
-- Dumping data for table `wp_training_logs`
--

INSERT INTO `wp_training_logs` (`id`, `division_id`, `collection_id`, `teacher_id`, `date`, `status`) VALUES
(6, 1, 8, 1, '2014-04-24 00:00:00', 'resumed'),
(5, 1, 8, 1, '2014-04-24 00:00:00', 'started'),
(7, 1, 9, 1, '2014-04-24 00:00:00', 'started'),
(8, 1, 28, 1, '2014-04-24 00:00:00', 'started'),
(9, 1, 23, 1, '2014-04-24 00:00:00', 'started');
