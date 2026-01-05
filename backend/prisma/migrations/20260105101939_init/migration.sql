-- CreateTable
CREATE TABLE `User` (
    `UserID` CHAR(36) NOT NULL DEFAULT (uuid()),
    `Name` VARCHAR(255) NULL,
    `Role` ENUM('User', 'Guest') NOT NULL,
    `Options` ENUM('Boss', 'Developer', 'Designer', 'Intern') NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `ProfilePicture` VARCHAR(255) NULL,
    `PhoneNumber` VARCHAR(20) NULL,
    `Optional` VARCHAR(255) NULL,
    `IsDeleted` BOOLEAN NULL DEFAULT false,
    `CreatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ModifiedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
