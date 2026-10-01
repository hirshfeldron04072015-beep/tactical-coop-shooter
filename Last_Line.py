import pygame
import random
import math
import string

# ------------------------------------------------------------
# Last Line - Playable Prototype
# ------------------------------------------------------------

pygame.init()
pygame.font.init()

WIDTH, HEIGHT = 1280, 720
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Last Line")
clock = pygame.time.Clock()

# Colors
BLACK = (10, 10, 14)
DARK = (27, 28, 35)
DARKER = (18, 18, 26)
MID = (54, 60, 74)
LIGHT = (195, 203, 216)
WHITE = (255, 255, 255)
RED = (214, 82, 82)
GREEN = (92, 192, 122)
BLUE = (101, 148, 250)
ORANGE = (255, 166, 77)
YELLOW = (240, 210, 90)
PURPLE = (162, 122, 255)

font_title = pygame.font.SysFont("arial", 42, bold=True)
font_big = pygame.font.SysFont("arial", 28, bold=True)
font_med = pygame.font.SysFont("arial", 22)
font_small = pygame.font.SysFont("arial", 18)

# ------------------------------------------------------------
# Data
# ------------------------------------------------------------

WEAPONS = {
    "primary": {
        "Pulse Rifle": {"slot": "primary", "damage": 14, "firerate": 0.12, "speed": 12, "spread": 0.08, "color": BLUE, "unlock_key": 0},
        "Shard Carbine": {"slot": "primary", "damage": 18, "firerate": 0.15, "speed": 11, "spread": 0.10, "color": PURPLE, "unlock_key": 15},
        "Plasma SMG": {"slot": "primary", "damage": 12, "firerate": 0.07, "speed": 13, "spread": 0.12, "color": ORANGE, "unlock_key": 30},
        "Scatter Shot": {"slot": "primary", "damage": 10, "firerate": 0.45, "speed": 10, "spread": 0.4, "color": YELLOW, "unlock_key": 45},
    },
    "secondary": {
        "Guardian Pistol": {"slot": "secondary", "damage": 20, "firerate": 0.25, "speed": 14, "spread": 0.04, "color": BLUE, "unlock_key": 0},
        "Volt Revolver": {"slot": "secondary", "damage": 26, "firerate": 0.32, "speed": 13, "spread": 0.06, "color": YELLOW, "unlock_key": 18},
        "Arc Launcher": {"slot": "secondary", "damage": 34, "firerate": 0.6, "speed": 11, "spread": 0.08, "color": ORANGE, "unlock_key": 35},
    },
    "melee": {
        "Combat Knife": {"slot": "melee", "damage": 32, "firerate": 0.52, "speed": 0, "spread": 0, "color": WHITE, "unlock_key": 0},
        "Shock Saber": {"slot": "melee", "damage": 44, "firerate": 0.42, "speed": 0, "spread": 0, "color": PURPLE, "unlock_key": 20},
        "Breaker Axe": {"slot": "melee", "damage": 58, "firerate": 0.7, "speed": 0, "spread": 0, "color": RED, "unlock_key": 40},
    },
    "utility": {
        "Field Medkit": {"slot": "utility", "damage": 0, "firerate": 0.0, "speed": 0, "spread": 0, "color": GREEN, "unlock_key": 0},
        "Smoke Bomb": {"slot": "utility", "damage": 0, "firerate": 0.0, "speed": 0, "spread": 0, "color": MID, "unlock_key": 14},
        "Shock Mine": {"slot": "utility", "damage": 20, "firerate": 0.0, "speed": 0, "spread": 0, "color": BLUE, "unlock_key": 26},
        "Dash Core": {"slot": "utility", "damage": 0, "firerate": 0.0, "speed": 0, "spread": 0, "color": ORANGE, "unlock_key": 38},
    }
}

MAPS = [
    {"name": "Rift District", "unlock_level": 1, "difficulty": 1},
    {"name": "Thermal Docks", "unlock_level": 2, "difficulty": 2},
    {"name": "Ashline Ruins", "unlock_level": 3, "difficulty": 3},
    {"name": "The Null Coast", "unlock_level": 4, "difficulty": 4},
    {"name": "Hollow Breach", "unlock_level": 5, "difficulty": 5},
]

MISSIONS = [
    {"title": "Sweep the Gate", "type": "kills", "target": 12, "reward_keys": 3, "reward_xp": 90},
    {"title": "Escort the Relic", "type": "time", "target": 35, "reward_keys": 5, "reward_xp": 130},
    {"title": "Hunt the Warden", "type": "boss", "target": 1, "reward_keys": 7, "reward_xp": 180},
    {"title": "Signal Recovery", "type": "kills", "target": 18, "reward_keys": 5, "reward_xp": 140},
    {"title": "Last Stand", "type": "survive", "target": 50, "reward_keys": 8, "reward_xp": 200},
]

STARTER_LOADOUT = {
    "primary": "Pulse Rifle",
    "secondary": "Guardian Pistol",
    "melee": "Combat Knife",
    "utility": "Field Medkit"
}

# ------------------------------------------------------------
# Utility
# ------------------------------------------------------------

def clamp(value, low, high):
    return max(low, min(high, value))

def distance(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

def generate_party_code():
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choice(chars) for _ in range(6))

def get_level_threshold(level):
    return 120 + (level - 1) * 80

def getUnlockedWeapons(player):
    result = {}
    for slot, items in WEAPONS.items():
        result[slot] = []
        for name, data in items.items():
            if data["unlock_key"] <= player["keys"] or name in STARTER_LOADOUT.values():
                result[slot].append(name)
    return result

# ------------------------------------------------------------
# Player / Entities
# ------------------------------------------------------------

class Bullet:
    def __init__(self, x, y, angle, damage, speed, color, radius=5, life=90):
        self.x = x
        self.y = y
        self.angle = angle
        self.damage = damage
        self.speed = speed
        self.color = color
        self.radius = radius
        self.life = life

    def update(self, dt):
        self.x += math.cos(self.angle) * self.speed * dt * 60
        self.y += math.sin(self.angle) * self.speed * dt * 60
        self.life -= 1 * dt * 60

    def draw(self, surf):
        pygame.draw.circle(surf, self.color, (int(self.x), int(self.y)), self.radius)

class Enemy:
    def __init__(self, x, y, radius, speed, hp, color):
        self.x = x
        self.y = y
        self.radius = radius
        self.speed = speed
        self.hp = hp
        self.max_hp = hp
        self.color = color
        self.hit_flash = 0

    def update(self, target, dt):
        dx = target.x - self.x
        dy = target.y - self.y
        d = max(1, math.hypot(dx, dy))
        self.x += (dx / d) * self.speed * dt * 60
        self.y += (dy / d) * self.speed * dt * 60
        self.hit_flash = max(0, self.hit_flash - dt * 60)

    def draw(self, surf):
        color = self.color
        if self.hit_flash > 0:
            color = WHITE
        pygame.draw.circle(surf, color, (int(self.x), int(self.y)), self.radius)
        bar_w = self.radius * 2
        bar_h = 5
        pygame.draw.rect(surf, BLACK, (int(self.x) - self.radius, int(self.y) - self.radius - 12, bar_w, bar_h))
        hp_ratio = clamp(self.hp / self.max_hp, 0, 1)
        pygame.draw.rect(surf, RED, (int(self.x) - self.radius, int(self.y) - self.radius - 12, int(bar_w * hp_ratio), bar_h))

class Pickup:
    def __init__(self, x, y, kind):
        self.x = x
        self.y = y
        self.kind = kind
        self.radius = 10
        self.phase = random.random() * math.tau

    def update(self, dt):
        self.phase += dt * 3

    def draw(self, surf):
        color = GREEN if self.kind == "xp" else YELLOW if self.kind == "key" else BLUE
        bob = math.sin(self.phase) * 4
        pygame.draw.circle(surf, color, (int(self.x), int(self.y) + int(bob)), self.radius)

class Particle:
    def __init__(self, x, y, color, vx, vy, life, size=3):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.color = color
        self.life = life
        self.size = size

    def update(self, dt):
        self.x += self.vx * dt * 60
        self.y += self.vy * dt * 60
        self.life -= dt * 60

    def draw(self, surf):
        pygame.draw.circle(surf, self.color, (int(self.x), int(self.y)), self.size)

class Player:
    def __init__(self, x, y, name="Rook"):
        self.x = x
        self.y = y
        self.name = name
        self.radius = 18
        self.speed = 4.2
        self.angle = 0
        self.health = 100
        self.max_health = 100
        self.level = 1
        self.xp = 0
        self.keys = 0
        self.inventory = {
            "primary": "Pulse Rifle",
            "secondary": "Guardian Pistol",
            "melee": "Combat Knife",
            "utility": "Field Medkit"
        }
        self.fire_cooldown = 0
        self.melee_cooldown = 0
        self.hit_flash = 0
        self.utility_cooldown = 0
        self.velocity_x = 0.0
        self.velocity_y = 0.0

    def move(self, dx, dy, dt):
        length = math.hypot(dx, dy)
        if length > 0:
            dx /= length
            dy /= length
        self.x += dx * self.speed * dt * 60
        self.y += dy * self.speed * dt * 60
        self.x = clamp(self.x, self.radius, WIDTH - self.radius)
        self.y = clamp(self.y, self.radius, HEIGHT - self.radius)

    def set_angle_from_target(self, tx, ty):
        self.angle = math.atan2(ty - self.y, tx - self.x)

    def shoot(self, bullets):
        if self.fire_cooldown > 0:
            return
        weapon_name = self.inventory["primary"]
        data = WEAPONS["primary"][weapon_name]
        spread = random.uniform(-data["spread"], data["spread"])
        ang = self.angle + spread
        x = self.x + math.cos(ang) * (self.radius + 10)
        y = self.y + math.sin(ang) * (self.radius + 10)
        bullets.append(Bullet(x, y, ang, data["damage"], data["speed"], data["color"]))
        self.fire_cooldown = data["firerate"] * 60

    def shoot_secondary(self, bullets):
        if self.fire_cooldown > 0:
            return
        weapon_name = self.inventory["secondary"]
        data = WEAPONS["secondary"][weapon_name]
        spread = random.uniform(-data["spread"], data["spread"])
        ang = self.angle + spread
        x = self.x + math.cos(ang) * (self.radius + 12)
        y = self.y + math.sin(ang) * (self.radius + 12)
        bullets.append(Bullet(x, y, ang, data["damage"], data["speed"], data["color"], radius=6))
        self.fire_cooldown = data["firerate"] * 60

    def melee_attack(self, enemies):
        if self.melee_cooldown > 0:
            return
        weapon_name = self.inventory["melee"]
        damage = WEAPONS["melee"][weapon_name]["damage"]
        for enemy in enemies:
            d = distance((self.x, self.y), (enemy.x, enemy.y))
            if d < self.radius + enemy.radius + 28:
                enemy.hp -= damage
                enemy.hit_flash = 12
                self.melee_cooldown = WEAPONS["melee"][weapon_name]["firerate"] * 60
                return

    def use_utility(self, particles, allies=None):
        if self.utility_cooldown > 0:
            return
        weapon_name = self.inventory["utility"]
        kind = weapon_name
        if kind == "Field Medkit":
            self.health = min(self.max_health, self.health + 28)
        elif kind == "Smoke Bomb":
            for _ in range(15):
                angle = random.random() * math.tau
                speed = random.uniform(1, 3)
                particles.append(Particle(self.x, self.y, MID, math.cos(angle)*speed, math.sin(angle)*speed, 40, 4))
        elif kind == "Shock Mine":
            for enemy in enemies:
                d = distance((self.x, self.y), (enemy.x, enemy.y))
                if d < 170:
                    enemy.hp -= 18
                    enemy.hit_flash = 14
        elif kind == "Dash Core":
            self.x += math.cos(self.angle) * 55
            self.y += math.sin(self.angle) * 55
            self.x = clamp(self.x, self.radius, WIDTH - self.radius)
            self.y = clamp(self.y, self.radius, HEIGHT - self.radius)
        self.utility_cooldown = 220

    def add_xp(self, amount):
        self.xp += amount
        while self.xp >= get_level_threshold(self.level):
            self.xp -= get_level_threshold(self.level)
            self.level += 1
            self.max_health += 10
            self.health = self.max_health
            self.keys += 2

    def draw(self, surf):
        # body
        color = BLUE if self.hit_flash <= 0 else WHITE
        pygame.draw.circle(surf, color, (int(self.x), int(self.y)), self.radius)
        # weapon direction
        gun_x = self.x + math.cos(self.angle) * (self.radius + 18)
        gun_y = self.y + math.sin(self.angle) * (self.radius + 18)
        pygame.draw.line(surf, LIGHT, (int(self.x), int(self.y)), (int(gun_x), int(gun_y)), 4)

        # name
        label = font_small.render(self.name, True, WHITE)
        surf.blit(label, (int(self.x) - 24, int(self.y) - 44))

        # health bar
        bar_w = 60
        bar_h = 7
        bx = int(self.x - bar_w / 2)
        by = int(self.y + self.radius + 12)
        pygame.draw.rect(surf, BLACK, (bx, by, bar_w, bar_h))
        hp_ratio = clamp(self.health / self.max_health, 0, 1)
        pygame.draw.rect(surf, GREEN, (bx, by, int(bar_w * hp_ratio), bar_h))

# ------------------------------------------------------------
# Game State
# ------------------------------------------------------------

class Game:
    def __init__(self):
        self.running = True
        self.state = "menu"
        self.clock = pygame.time.Clock()
        self.party_code = ""
        self.join_code = ""
        self.map_name = "Rift District"
        self.selected_map_idx = 0
        self.current_mission = 0
        self.mission_progress = 0
        self.mission_started = False
        self.wave = 1
        self.game_timer = 0
        self.enemies = []
        self.bullets = []
        self.pickups = []
        self.particles = []
        self.player = Player(WIDTH / 2, HEIGHT / 2, "Rook")
        self.message = ""
        self.message_timer = 0
        self.squad_size = 1

        # Controls
        self.player_aim = (WIDTH/2, HEIGHT/2)
        self.mouse_down = False

    def set_message(self, text, duration=120):
        self.message = text
        self.message_timer = duration

    def start_game(self):
        self.state = "playing"
        self.enemy_spawn_delay = 50
        self.waves = 1
        self.spawn_wave()
        self.current_mission = 0
        self.mission_progress = 0
        self.mission_started = True

    def spawn_wave(self):
        count = min(5 + self.wave * 2, 20)
        for _ in range(count):
            side = random.choice(["top", "bottom", "left", "right"])
            if side == "top":
                x = random.randint(0, WIDTH)
                y = -30
            elif side == "bottom":
                x = random.randint(0, WIDTH)
                y = HEIGHT + 30
            elif side == "left":
                x = -30
                y = random.randint(0, HEIGHT)
            else:
                x = WIDTH + 30
                y = random.randint(0, HEIGHT)

            radius = random.randint(14, 20)
            speed = random.uniform(0.8, 1.5) + self.wave * 0.15
            hp = random.randint(22, 34) + self.wave * 4
            color = (random.randint(100, 220), random.randint(50, 120), random.randint(50, 120))
            self.enemies.append(Enemy(x, y, radius, speed, hp, color))

    def spawn_pickup(self, x, y, kind):
        self.pickups.append(Pickup(x, y, kind))

    def spawn_particles(self, x, y, color, count=10):
        for _ in range(count):
            angle = random.random() * math.tau
            speed = random.uniform(1.0, 3.5)
            self.particles.append(Particle(x, y, color, math.cos(angle) * speed, math.sin(angle) * speed, random.randint(18, 40), random.randint(2, 5)))

    def handle_event(self, event):
        if event.type == pygame.QUIT:
            self.running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                self.mouse_down = True
        elif event.type == pygame.MOUSEBUTTONUP:
            if event.button == 1:
                self.mouse_down = False

    def get_keys(self):
        return pygame.key.get_pressed()

    def update_menu(self, keys):
        # Enter party code from keyboard
        if keys[pygame.K_1]:
            self.party_code = generate_party_code()
            self.state = "lobby"
            self.squad_size = 1
            self.set_message(f"Party created: {self.party_code}", 180)
        elif keys[pygame.K_2]:
            self.state = "join"
            self.join_code = ""
            self.set_message("Join a party - type code and press Enter", 180)
        elif keys[pygame.K_3]:
            self.start_game()

        if self.state == "lobby":
            if keys[pygame.K_RETURN]:
                self.start_game()

    def update_join(self, keys):
        if keys[pygame.K_RETURN] and self.join_code:
            if self.join_code.upper() == self.party_code.upper() or self.join_code == "JOIN":
                self.start_game()
            else:
                self.set_message("Code invalid. Try again.", 150)

    def update_game(self, dt, keys):
        self.game_timer += dt
        self.player.fire_cooldown = max(0, self.player.fire_cooldown - dt * 60)
        self.player.melee_cooldown = max(0, self.player.melee_cooldown - dt * 60)
        self.player.utility_cooldown = max(0, self.player.utility_cooldown - dt * 60)
        self.player.hit_flash = max(0, self.player.hit_flash - dt * 60)

        # Player movement
        move_x = (keys[pygame.K_d] or keys[pygame.K_RIGHT]) - (keys[pygame.K_a] or keys[pygame.K_LEFT])
        move_y = (keys[pygame.K_s] or keys[pygame.K_DOWN]) - (keys[pygame.K_w] or keys[pygame.K_UP])
        self.player.move(move_x, move_y, dt)

        # Mouse aim
        mx, my = pygame.mouse.get_pos()
        self.player.set_angle_from_target(mx, my)

        # Shooting
        if self.mouse_down or keys[pygame.K_SPACE]:
            self.player.shoot(self.bullets)
        if keys[pygame.K_LSHIFT]:
            self.player.shoot_secondary(self.bullets)
        if keys[pygame.K_f]:
            self.player.melee_attack(self.enemies)
        if keys[pygame.K_q]:
            self.player.use_utility(self.particles)

        # Enemy spawn
        self.enemy_spawn_delay = max(0, self.enemy_spawn_delay - dt * 60)
        if self.enemy_spawn_delay <= 0:
            self.spawn_wave()
            self.enemy_spawn_delay = max(20, 100 - self.wave * 4)
            self.wave += 1

        # Update bullets
        for bullet in self.bullets[:]:
            bullet.update(dt)
            if bullet.life <= 0:
                self.bullets.remove(bullet)
                continue
            if bullet.x < -20 or bullet.x > WIDTH + 20 or bullet.y < -20 or bullet.y > HEIGHT + 20:
                self.bullets.remove(bullet)
                continue
            for enemy in self.enemies[:]:
                if distance((bullet.x, bullet.y), (enemy.x, enemy.y)) < bullet.radius + enemy.radius:
                    enemy.hp -= bullet.damage
                    enemy.hit_flash = 10
                    self.spawn_particles(bullet.x, bullet.y, bullet.color, 6)
                    self.bullets.remove(bullet)
                    if enemy.hp <= 0:
                        self.enemies.remove(enemy)
                        self.player.add_xp(15)
                        self.mission_progress += 1
                        if random.random() < 0.35:
                            self.spawn_pickup(enemy.x, enemy.y, "xp")
                        if random.random() < 0.10:
                            self.spawn_pickup(enemy.x, enemy.y, "key")
                    break

        # Enemy update
        for enemy in self.enemies[:]:
            enemy.update(self.player, dt)
            if distance((enemy.x, enemy.y), (self.player.x, self.player.y)) < enemy.radius + self.player.radius:
                self.player.health -= 14
                self.player.hit_flash = 15
                enemy.hit_flash = 15
                self.spawn_particles(self.player.x, self.player.y, RED, 8)
                if self.player.health <= 0:
                    self.state = "game_over"
                    self.set_message("Mission failed.", 240)
                if enemy.hp <= 0:
                    self.enemies.remove(enemy)

        # Pickups
        for pickup in self.pickups[:]:
            pickup.update(dt)
            if distance((pickup.x, pickup.y), (self.player.x, self.player.y)) < pickup.radius + self.player.radius + 8:
                if pickup.kind == "xp":
                    self.player.add_xp(40)
                    self.set_message("+40 XP", 30)
                elif pickup.kind == "key":
                    self.player.keys += 1
                    self.set_message("+1 key", 30)
                else:
                    self.player.health = min(self.player.max_health, self.player.health + 20)
                self.pickups.remove(pickup)

        # Particles
        for particle in self.particles[:]:
            particle.update(dt)
            if particle.life <= 0:
                self.particles.remove(particle)

        # Mission progression
        if self.mission_started:
            mission = MISSIONS[self.current_mission]
            if mission["type"] == "kills":
                if self.mission_progress >= mission["target"]:
                    self.complete_mission(mission)
            elif mission["type"] == "boss":
                if self.mission_progress >= mission["target"]:
                    self.complete_mission(mission)
            elif mission["type"] == "time":
                if self.game_timer >= mission["target"]:
                    self.complete_mission(mission)
            elif mission["type"] == "survive":
                if self.game_timer >= mission["target"]:
                    self.complete_mission(mission)

        # Level unlocks
        unlocks = getUnlockedWeapons(self.player)
        available = []
        for slot, names in unlocks.items():
            available.extend(names)
        # unlock map based on level
        for idx, m in enumerate(MAPS):
            if self.player.level >= m["unlock_level"]:
                pass

        # If no enemies left, create more
        if len(self.enemies) == 0 and self.state == "playing":
            self.wave += 1
            self.spawn_wave()

    def complete_mission(self, mission):
        self.player.keys += mission["reward_keys"]
        self.player.add_xp(mission["reward_xp"])
        self.set_message(f"Mission complete: {mission['title']}", 180)
        self.current_mission += 1
        self.mission_progress = 0
        self.mission_started = self.current_mission < len(MISSIONS)
        self.wave += 1
        self.spawn_wave()

    def draw_background(self):
        screen.fill(DARK)
        # grid
        for x in range(0, WIDTH, 50):
            pygame.draw.line(screen, MID, (x, 0), (x, HEIGHT), 1)
        for y in range(0, HEIGHT, 50):
            pygame.draw.line(screen, MID, (0, y), (WIDTH, y), 1)

    def draw_menu(self):
        self.draw_background()
        title = font_title.render("LAST LINE", True, WHITE)
        screen.blit(title, (WIDTH // 2 - title.get_width() // 2, 90))

        text = [
            "1. Create Party",
            "2. Join Party",
            "3. Start Solo",
            "",
            "Controls:",
            "WASD move",
            "Mouse aim",
            "Left click / Space shoot",
            "Shift secondary fire",
            "F melee",
            "Q utility",
            "Esc quit",
        ]
        y = 200
        for line in text:
            label = font_med.render(line, True, LIGHT)
            screen.blit(label, (240, y))
            y += 35

        if self.party_code:
            code = font_big.render(f"Party Code: {self.party_code}", True, GREEN)
            screen.blit(code, (240, 550))

        if self.message:
            msg = font_med.render(self.message, True, YELLOW)
            screen.blit(msg, (240, 610))

    def draw_lobby(self):
        self.draw_background()
        title = font_title.render("LOBBY", True, WHITE)
        screen.blit(title, (WIDTH // 2 - title.get_width() // 2, 80))

        party_label = font_big.render(f"Party Code: {self.party_code}", True, GREEN)
        screen.blit(party_label, (WIDTH // 2 - party_label.get_width() // 2, 170))

        squad = font_med.render(f"Squad Size: {self.squad_size}", True, LIGHT)
        screen.blit(squad, (WIDTH // 2 - squad.get_width() // 2, 220))

        map_title = font_big.render("Available Maps:", True, WHITE)
        screen.blit(map_title, (210, 270))

        for i, m in enumerate(MAPS):
            color = GREEN if i == self.selected_map_idx else LIGHT
            label = font_med.render(f"{i+1}. {m['name']}  (Unlock Lv {m['unlock_level']})", True, color)
            screen.blit(label, (260, 310 + i * 35))

        hint = font_med.render("Press Enter to deploy", True, YELLOW)
        screen.blit(hint, (WIDTH // 2 - hint.get_width() // 2, 620))

        if self.message:
            msg = font_med.render(self.message, True, ORANGE)
            screen.blit(msg, (260, 660))

    def draw_join(self):
        self.draw_background()
        title = font_title.render("JOIN PARTY", True, WHITE)
        screen.blit(title, (WIDTH // 2 - title.get_width() // 2, 90))

        prompt = font_med.render("Type party code and press Enter:", True, LIGHT)
        screen.blit(prompt, (300, 220))

        code_box = pygame.Rect(300, 270, 680, 52)
        pygame.draw.rect(screen, MID, code_box, border_radius=8)
        pygame.draw.rect(screen, LIGHT, code_box, 2, border_radius=8)
        value = font_big.render(self.join_code.upper(), True, WHITE)
        screen.blit(value, (320, 282))

        if self.message:
            msg = font_med.render(self.message, True, ORANGE)
            screen.blit(msg, (300, 360))

    def draw_game(self):
        self.draw_background()

        # Entities
        for bullet in self.bullets:
            bullet.draw(screen)
        for pickup in self.pickups:
            pickup.draw(screen)
        for enemy in self.enemies:
            enemy.draw(screen)
        for p in self.particles:
            p.draw(screen)

        self.player.draw(screen)

        # HUD
        hp = font_med.render(f"HP: {int(self.player.health)}/{self.player.max_health}", True, WHITE)
        screen.blit(hp, (20, 20))
        xp = font_med.render(f"LV {self.player.level} • XP {self.player.xp}/{get_level_threshold(self.player.level)}", True, WHITE)
        screen.blit(xp, (20, 50))
        keys = font_med.render(f"Keys: {self.player.keys}", True, YELLOW)
        screen.blit(keys, (20, 80))

        # Map and wave
        map_text = font_med.render(f"Map: {self.map_name}", True, LIGHT)
        screen.blit(map_text, (WIDTH - 260, 20))
        wave_text = font_med.render(f"Wave: {self.wave}", True, LIGHT)
        screen.blit(wave_text, (WIDTH - 260, 50))

        # Mission
        if self.current_mission < len(MISSIONS):
            mission = MISSIONS[self.current_mission]
            mission_text = font_med.render(f"Mission: {mission['title']}", True, ORANGE)
            screen.blit(mission_text, (20, HEIGHT - 90))
            mission_progress = font_med.render(f"Progress: {self.mission_progress}/{mission['target']}", True, LIGHT)
            screen.blit(mission_progress, (20, HEIGHT - 60))
        else:
            complete_text = font_big.render("All missions complete", True, GREEN)
            screen.blit(complete_text, (WIDTH // 2 - complete_text.get_width() // 2, HEIGHT - 90))

        if self.message:
            txt = font_med.render(self.message, True, YELLOW)
            screen.blit(txt, (WIDTH // 2 - txt.get_width() // 2, HEIGHT - 35))
            self.message_timer -= 1
            if self.message_timer <= 0:
                self.message = ""

    def draw_game_over(self):
        self.draw_background()
        title = font_title.render("MISSION FAILED", True, RED)
        screen.blit(title, (WIDTH // 2 - title.get_width() // 2, 220))
        score = font_big.render(f"Level: {self.player.level} | Keys: {self.player.keys} | XP: {self.player.xp}", True, WHITE)
        screen.blit(score, (WIDTH // 2 - score.get_width() // 2, 300))
        hint = font_med.render("Press R to restart or Esc to menu", True, LIGHT)
        screen.blit(hint, (WIDTH // 2 - hint.get_width() // 2, 350))

    def run(self):
        while self.running:
            dt = self.clock.tick(60) / 1000.0
            keys = pygame.key.get_pressed()

            if self.state == "menu":
                self.update_menu(keys)

            elif self.state == "lobby":
                # keyboard map selection
                if keys[pygame.K_UP]:
                    self.selected_map_idx = max(0, self.selected_map_idx - 1)
                elif keys[pygame.K_DOWN]:
                    self.selected_map_idx = min(len(MAPS) - 1, self.selected_map_idx + 1)
                self.map_name = MAPS[self.selected_map_idx]["name"]
                if keys[pygame.K_RETURN]:
                    self.start_game()

            elif self.state == "join":
                for event in pygame.event.get():
                    if event.type == pygame.KEYDOWN:
                        if event.key == pygame.K_RETURN:
                            if self.join_code:
                                if self.join_code.upper() == "JOIN" or self.join_code.upper() == self.party_code.upper():
                                    self.start_game()
                                else:
                                    self.message = "Invalid party code"
                                    self.message_timer = 120
                        elif event.key == pygame.K_BACKSPACE:
                            self.join_code = self.join_code[:-1]
                        elif event.unicode.isalnum():
                            if len(self.join_code) < 12:
                                self.join_code += event.unicode.upper()

            elif self.state == "playing":
                self.update_game(dt, keys)

            elif self.state == "game_over":
                if keys[pygame.K_r]:
                    self.__init__()
                elif keys[pygame.K_ESCAPE]:
                    self.state = "menu"

            # Drawing
            if self.state == "menu":
                self.draw_menu()
            elif self.state == "lobby":
                self.draw_lobby()
            elif self.state == "join":
                self.draw_join()
            elif self.state == "playing":
                self.draw_game()
            elif self.state == "game_over":
                self.draw_game_over()

            # global events
            for event in pygame.event.get():
                self.handle_event(event)

            if self.state == "join" and self.message:
                if self.message_timer > 0:
                    self.message_timer -= 1
                    if self.message_timer <= 0:
                        self.message = ""

            pygame.display.flip()

        pygame.quit()


if __name__ == "__main__":
    game = Game()
    game.run()
