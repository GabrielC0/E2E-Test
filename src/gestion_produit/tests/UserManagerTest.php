<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../UserManager.php';

class UserManagerTest extends TestCase {
    private $pdoMock;
    private $userManager;

    protected function setUp(): void {
        $this->pdoMock = $this->createMock(PDO::class);
        $this->userManager = new UserManager();
        $reflection = new ReflectionClass($this->userManager);
        $property = $reflection->getProperty('db');
        $property->setAccessible(true);
        $property->setValue($this->userManager, $this->pdoMock);
    }

    public function testAddUser(): void {
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('execute')->with(['name' => 'John Doe', 'email' => 'john@example.com']);
        $this->pdoMock->expects($this->once())->method('prepare')->with("INSERT INTO users (name, email) VALUES (:name, :email)")->willReturn($stmtMock);

        $this->userManager->addUser('John Doe', 'john@example.com');
    }

    public function testAddUserEmailException(): void {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage("Email invalide.");

        $this->userManager->addUser('John Doe', 'invalid-email');
    }

    public function testUpdateUser(): void {
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('execute')->with(['id' => 1, 'name' => 'Jane Doe', 'email' => 'jane@example.com']);
        // Ajouter cette ligne pour simuler qu'une ligne a été modifiée
        $stmtMock->expects($this->once())->method('rowCount')->willReturn(1);
        $this->pdoMock->expects($this->once())->method('prepare')->with("UPDATE users SET name = :name, email = :email WHERE id = :id")->willReturn($stmtMock);

        $this->userManager->updateUser(1, 'Jane Doe', 'jane@example.com');
    }

    public function testRemoveUser(): void {
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('execute')->with(['id' => 1]);
        // Ajouter cette ligne pour simuler qu'une ligne a été supprimée
        $stmtMock->expects($this->once())->method('rowCount')->willReturn(1);
        $this->pdoMock->expects($this->once())->method('prepare')->with("DELETE FROM users WHERE id = :id")->willReturn($stmtMock);

        $this->userManager->removeUser(1);
    }
    
    public function testGetUsers(): void {
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('fetchAll')->willReturn([['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com']]);
        $this->pdoMock->expects($this->once())->method('query')->with("SELECT * FROM users")->willReturn($stmtMock);

        $users = $this->userManager->getUsers();
        $this->assertCount(1, $users);
        $this->assertEquals('John Doe', $users[0]['name']);
    }

    public function testInvalidUpdateThrowsException(): void {
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('execute')->with(['id' => 999, 'name' => 'Non Existent', 'email' => 'nonexistent@example.com']);
        $stmtMock->expects($this->once())->method('rowCount')->willReturn(0);
        $this->pdoMock->expects($this->once())->method('prepare')->with("UPDATE users SET name = :name, email = :email WHERE id = :id")->willReturn($stmtMock);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Utilisateur introuvable.");

        $this->userManager->updateUser(999, 'Non Existent', 'nonexistent@example.com');
    }

    public function testInvalidDeleteThrowsException(): void {
        $stmtMock = $this->createMock(PDOStatement::class);
        $stmtMock->expects($this->once())->method('execute')->with(['id' => 999]);
        $stmtMock->expects($this->once())->method('rowCount')->willReturn(0);
        $this->pdoMock->expects($this->once())->method('prepare')->with("DELETE FROM users WHERE id = :id")->willReturn($stmtMock);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Utilisateur introuvable.");

        $this->userManager->removeUser(999);
    }
}
?>