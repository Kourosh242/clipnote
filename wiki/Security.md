# Security

[English](Home) · [فارسی](خانه)

Each note can be locked with a password or a 4-digit PIN.

- Secrets are hashed with PBKDF2-SHA256, 150,000 iterations, random salt
- The original password is never stored
- An optional recovery question stores only a hash of the answer
- Locked previews stay hidden until the current session unlocks them

This is convenient note-level protection inside Chrome storage, not full-disk encryption. Someone with OS access to the Chrome profile can still read the storage files.
