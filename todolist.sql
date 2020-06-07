/*
 Navicat MySQL Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : todolist

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 07/06/2020 23:59:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for list
-- ----------------------------
DROP TABLE IF EXISTS `list`;
CREATE TABLE `list`  (
  `taskid` int(0) NOT NULL AUTO_INCREMENT,
  `userid` int(0) NOT NULL,
  `task` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `isdone` tinyint(1) NOT NULL DEFAULT 0,
  `creattime` timestamp(0) NOT NULL,
  `key` bigint(0) NOT NULL,
  PRIMARY KEY (`taskid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for load_time
-- ----------------------------
DROP TABLE IF EXISTS `load_time`;
CREATE TABLE `load_time`  (
  `lid` int(0) NOT NULL AUTO_INCREMENT,
  `loadtime` int(0) NOT NULL,
  PRIMARY KEY (`lid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for login_times_daily
-- ----------------------------
DROP TABLE IF EXISTS `login_times_daily`;
CREATE TABLE `login_times_daily`  (
  `date` date NOT NULL,
  `times` int(0) NOT NULL DEFAULT 1
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userid` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `usertype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `apikey` bigint(0) NOT NULL,
  `logintime` datetime(0) NOT NULL,
  PRIMARY KEY (`userid`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
