import pygame
import random
import math

# ----------------------------
# Game configuration
# ----------------------------
WIDTH, HEIGHT = 960, 540
FPS = 60

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 50, 50)
GREEN = (50, 255, 120)
BLUE = (70, 130, 255)
YELLOW = (255, 220, 80)
ORANGE = (255, 140, 50)
DARK = (22, 22, 30)
LIGHT_DARK = (38, 38, 48)

pygame.init()
pygame.mixer.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Survival Arena")
clock = pygame.time.Clock()

# Fonts
font_big = pygame.font.SysFont("arial", 36, bold=True)
font_med = pygame.font.SysFont("arial", 24)
font_small = pygame.font.SysFont("arial", 18)

# ----------------------------
# Helpers
# ----------------------------
def distance(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

def clamp(value, min_value, max_value):
    return max(min_value, min(value, max_value))

# ----------------------------
# Player
# ----------------------------
class Player:
    def __init__(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.radius = 16
        self.speed = 4.5
        self.health = 100
        self.max_health = 100
        self.angle = 0
        self.fire_cooldown = 0
        self.score = 0
        self.invuln = 0

    def update(self, keys, mouse_pos):
        move_x = (keys[pygame.K_d] or keys[pygame.K_RIGHT]) - (keys[pygame.K_a] or keys[pygame.K_LEFT])
        move_y = (keys[pygame.K_s] or keys[pygame.K_DOWN]) - (keys[pygame.K_w] or keys[pygame.K_UP])

        magnitude = math.hypot(move_x, move_y)
        if magnitude:
            move_x /= magnitude
            move_y /= magnitude

        self.x += move_x * self.speed * 1.5
        self.y += move_y * self.speed * 1.5

        self.x = clamp(self.x, self.radius, WIDTH - self.radius)
        self.y = clamp(self.y, self.radius, HEIGHT - self.radius)

        dx = mouse_pos[0] - self.x
        dy = mouse_pos[1] - self.y
        self.angle = math.atan2(dy, dx)

        if self.fire_cooldown > 0:
            self.fire_cooldown -= 1

    def shoot(self, bullets):
        if self.fire_cooldown == 0:
            muzzle_x = self.x + math.cos(self.angle) * (self.radius + 10)
            muzzle_y = self.y + math.sin(self.angle) * (self.radius + 10)
            bullet = Bullet(muzzle_x, muzzle_y, self.angle, 8, BLUE)
            bullets.append(bullet)
            self.fire_cooldown = 9

    def draw(self, screen):
        # Body
        pygame.draw.circle(screen, BLUE, (int(self.x), int(self.y)), self.radius)

        # Gun
        gun_len = 20
        gun_x = self.x + math.cos(self.angle) * gun_len
        gun_y = self.y + math.sin(self.angle) * gun_len
        pygame.draw.line(screen, WHITE, (int(self.x), int(self.y)), (int(gun_x), int(gun_y)), 5)

        # Health bar
        bar_w = 70
        bar_h = 8
        x = self.x - bar_w // 2
        y = self.y - self.radius - 18
        pygame.draw.rect(screen, DARK, (x, y, bar_w, bar_h))
        hp_ratio = self.health / self.max_health
        pygame.draw.rect(screen, GREEN, (x, y, int(bar_w * hp_ratio), bar_h))

    def damage(self, amount):
        if self.invuln > 0:
            return
        self.health -= amount
        self.invuln = 30

# ----------------------------
# Bullet
# ----------------------------
class Bullet:
    def __init__(self, x, y, angle, speed, color):
        self.x = x
        self.y = y
        self.angle = angle
        self.speed = speed
        self.radius = 5
        self.color = color
        self.life = 120

    def update(self):
        self.x += math.cos(self.angle) * self.speed
        self.y += math.sin(self.angle) * self.speed
        self.life -= 1

    def draw(self, screen):
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.radius)

# ----------------------------
# Enemy
# ----------------------------
class Enemy:
    def __init__(self, x, y, speed, radius, color, hp):
        self.x = x
        self.y = y
        self.speed = speed
        self.radius = radius
        self.color = color
        self.hp = hp
        self.max_hp = hp

    def update(self, player):
        dx = player.x - self.x
        dy = player.y - self.y
        dist = max(1, math.hypot(dx, dy))
        self.x += (dx / dist) * self.speed
        self.y += (dy / dist) * self.speed

    def draw(self, screen):
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.radius)

        # health bar
        bar_w = self.radius * 2
        bar_h = 5
        x = int(self.x - self.radius)
        y = int(self.y - self.radius - 12)
        pygame.draw.rect(screen, DARK, (x, y, bar_w, bar_h))
        hp_ratio = self.hp / self.max_hp
        pygame.draw.rect(screen, RED, (x, y, int(bar_w * hp_ratio), bar_h))

# ----------------------------
# Particles
# ----------------------------
class Particle:
    def __init__(self, x, y, color, vx, vy, radius, life):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.color = color
        self.radius = radius
        self.life = life

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.life -= 1

    def draw(self, screen):
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), int(self.radius))

# ----------------------------
# Game state
# ----------------------------
player = Player()
bullets = []
enemies = []
particles = []
spawn_timer = 0
game_over = False
elapsed = 0

# ----------------------------
# Utility functions
# ----------------------------
def spawn_enemy():
    side = random.randint(0, 3)
    if side == 0:  # top
        x = random.randint(0, WIDTH)
        y = -30
    elif side == 1:  # right
        x = WIDTH + 30
        y = random.randint(0, HEIGHT)
    elif side == 2:  # bottom
        x = random.randint(0, WIDTH)
        y = HEIGHT + 30
    else:  # left
        x = -30
        y = random.randint(0, HEIGHT)

    speed = random.uniform(1.1, 2.5) + min(1.5, elapsed / 500)
    radius = random.randint(14, 24)
    hp = random.randint(1, 3)
    color = (random.randint(120, 255), random.randint(40, 140), random.randint(40, 140))
    enemies.append(Enemy(x, y, speed, radius, color, hp))

def spawn_particles(x, y, color, amount=12):
    for _ in range(amount):
        angle = random.random() * math.tau
        speed = random.uniform(0.5, 3.5)
        px = x + random.uniform(-2, 2)
        py = y + random.uniform(-2, 2)
        vx = math.cos(angle) * speed
        vy = math.sin(angle) * speed
        particles.append(Particle(px, py, color, vx, vy, random.uniform(2, 5), random.randint(15, 40)))

# ----------------------------
# Main loop
# ----------------------------
running = True
while running:
    clock.tick(FPS)
    mouse_x, mouse_y = pygame.mouse.get_pos()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN and not game_over:
            if event.button == 1:
                player.shoot(bullets)

    keys = pygame.key.get_pressed()

    if not game_over:
        player.update(keys, (mouse_x, mouse_y))

        # Spawn enemies
        elapsed += clock.get_time()
        spawn_timer -= clock.get_time()
        if spawn_timer <= 0:
            spawn_enemy()
            spawn_timer = max(500, 1800 - elapsed * 0.06)

        # Bullet update / collision
        for bullet in bullets[:]:
            bullet.update()
            if bullet.life <= 0:
                bullets.remove(bullet)
                continue

            # remove off-screen bullets
            if bullet.x < -20 or bullet.x > WIDTH + 20 or bullet.y < -20 or bullet.y > HEIGHT + 20:
                bullets.remove(bullet)
                continue

            for enemy in enemies[:]:
                if distance((bullet.x, bullet.y), (enemy.x, enemy.y)) <= bullet.radius + enemy.radius:
                    enemy.hp -= 1
                    spawn_particles(bullet.x, bullet.y, bullet.color, 5)
                    bullets.remove(bullet)
                    if enemy.hp <= 0:
                        enemies.remove(enemy)
                        spawn_particles(enemy.x, enemy.y, enemy.color, 12)
                        player.score += 10
                    break

        # Enemy update / collision
        for enemy in enemies:
            enemy.update(player)
            if distance((player.x, player.y), (enemy.x, enemy.y)) <= player.radius + enemy.radius:
                player.damage(15)
                spawn_particles(player.x, player.y, RED, 18)
                enemy.hp -= 2
                if enemy.hp <= 0:
                    enemies.remove(enemy)
                    player.score += 5

        # Lose condition
        if player.health <= 0:
            game_over = True

        # Player invulnerability flicker
        if player.invuln > 0:
            player.invuln -= 1

        # Particles update
        for particle in particles[:]:
            particle.update()
            if particle.life <= 0:
                particles.remove(particle)

    # Background
    screen.fill(DARK)

    # Draw world grid
    for x in range(0, WIDTH, 40):
        pygame.draw.line(screen, LIGHT_DARK, (x, 0), (x, HEIGHT), 1)
    for y in range(0, HEIGHT, 40):
        pygame.draw.line(screen, LIGHT_DARK, (0, y), (WIDTH, y), 1)

    # Draw bullets
    for bullet in bullets:
        bullet.draw(screen)

    # Draw enemies
    for enemy in enemies:
        enemy.draw(screen)

    # Draw particles
    for particle in particles:
        particle.draw(screen)

    # Draw player
    if not game_over:
        player.draw(screen)

    # HUD
    score_text = font_med.render(f"Score: {player.score}", True, WHITE)
    screen.blit(score_text, (18, 18))

    health_text = font_med.render(f"HP: {player.health}/{player.max_health}", True, WHITE)
    screen.blit(health_text, (18, 48))

    if game_over:
        overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 160))
        screen.blit(overlay, (0, 0))

        game_over_text = font_big.render("GAME OVER", True, RED)
        game_over_rect = game_over_text.get_rect(center=(WIDTH // 2, HEIGHT // 2 - 30))
        screen.blit(game_over_text, game_over_rect)

        restart_text = font_med.render(f"Final Score: {player.score}  |  Press R to restart", True, WHITE)
        restart_rect = restart_text.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 30))
        screen.blit(restart_text, restart_rect)

        if keys[pygame.K_r]:
            player = Player()
            bullets.clear()
            enemies.clear()
            particles.clear()
            spawn_timer = 0
            game_over = False
            elapsed = 0

    pygame.display.flip()

pygame.quit()
