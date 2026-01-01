# Cabinet‑Maker – Build & Deployment Guide

This README provides **step‑by‑step, copy‑paste–ready instructions** to safely manage, build, reset, and deploy the Cabinet‑Maker project using the provided shell scripts.

The guide is written for **Linux / Ubuntu / WSL (Windows Subsystem for Linux)** environments.

---

## 1. Prerequisites

Before running any script, ensure the following:

### Operating System

* Ubuntu 20.04+ or equivalent Linux distro
* Windows users must use **WSL2 (Ubuntu)**

### Required Software

Install once:

```bash
sudo apt update
sudo apt install -y git curl build-essential
```

---

## 2. Clone the Repository (First Time Only)

```bash
cd ~
git clone https://github.com/heidi-dang/cabinet-maker.git
cd cabinet-maker
```

This creates the project directory:

```text
~/cabinet-maker
```

---

## 3. Script Overview (What Each Script Does)

| Script            | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `auto-build.sh`   | Pull latest code, clean, install deps, build |
| `build.sh`        | Build the project only                       |
| `reset-repo.sh`   | Hard reset repo to remote state              |
| `deploy-nginx.sh` | Deploy built files to Nginx                  |

---

## 4. Make All Scripts Executable (Required Once)

Run this **once** after cloning:

```bash
chmod +x auto-build.sh build.sh deploy-nginx.sh reset-repo.sh
```

---

## 5. auto-build.sh (Recommended Daily Use)

### What it does

* Fetches latest Git code
* Hard resets to remote branch
* Removes cache and old builds
* Installs dependencies
* Runs production build

### How to run

```bash
cd ~/cabinet-maker
./auto-build.sh
```

### Output

```text
dist/
```

If this script succeeds, your build is clean and production‑ready.

---

## 6. build.sh (Build Only)

### When to use

* Code already up to date
* Dependencies already installed
* You only want to rebuild

### How to run

```bash
cd ~/cabinet-maker
./build.sh
```

### Notes

* Does **not** pull Git changes
* Does **not** reset repo

---

## 7. reset-repo.sh (Emergency Recovery)

### When to use

* Code is broken
* You want to discard **all local changes**
* Build keeps failing unexpectedly

⚠️ **WARNING**: This permanently deletes local changes.

### How to run

```bash
cd ~/cabinet-maker
./reset-repo.sh
```

### What happens

* `git fetch`
* `git reset --hard origin/main`
* `git clean -fd`

Your repo returns to a clean remote state.

---

## 8. deploy-nginx.sh (Production Deployment)

### Requirements

* Ubuntu server or VPS
* Root or sudo access
* Nginx not blocked by firewall

### What it does

* Installs Nginx (if missing)
* Runs production build
* Copies `dist/` to `/var/www/cabinet-maker`
* Configures Nginx
* Reloads server

### How to run

```bash
cd ~/cabinet-maker
sudo ./deploy-nginx.sh
```

### Access site

```text
http://<SERVER-IP>
```

---

## 9. Recommended Workflow

### Daily development

```bash
./auto-build.sh
```

### If something breaks

```bash
./reset-repo.sh
./auto-build.sh
```

### Production deploy

```bash
sudo ./deploy-nginx.sh
```

---

---
## 10. Common Issues & Fixes

| Problem             | Solution                             |
| ------------------- | ------------------------------------ |
| `del: not found`    | Linux uses `rimraf`, already handled |
| Parcel cache error  | Run `auto-build.sh`                  |
| Node version issues | Script installs Node 18              |
| Permission denied   | Use `chmod +x`                       |

---

## 11. Node & Build Details

* Node.js: **v18 LTS**
* Bundler: **Parcel**
* Output: `dist/`
* Framework: React + TypeScript

---



---

**End of documentation**
