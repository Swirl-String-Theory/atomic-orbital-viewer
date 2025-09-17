# Atomic Orbital 3D Viewer · SST Mode + Knot Lab

An interactive **web-based 3D viewer for atomic orbitals** with optional **Swirl-String Theory (SST)** overlays, **R/T (m=±|m|) superpositions**, and a **Knot Lab** for visualizing Fourier-series knots.  


Using modern web technologies, you can navigate orbitals in real time, rotate/zoom in 3D, inspect cross-sections, color by physical overlays, and compare orbital nodal structures with canonical knots.


---

## Features

- **Hydrogenic orbitals**  
  Real-time 3D isosurfaces with an interactive **XZ cross-section** panel and $$|\psi|^2$$ distributions.

- **SST Mode (toggle)**  
  Swap the Bohr scale $$a_0$$ for an SST scale  
  $$
  a_{\mathrm{SST}}=\frac{\hbar^2}{\mu\,g_{\mathrm{swirl}}},\qquad
  g_{\mathrm{swirl}}=\beta\,F^{\max}_{\text{Coul}}\,r_c^{\,2}
  $$
  and compute energies $$E_n=-\mu g_{\mathrm{swirl}}^{2}/(2\hbar^2n^2)$$.  
  Overlays:
    - **Swirl velocity** $$\mathbf v=\frac{\hbar m}{\mu r\sin\theta}\,\mathbf e_\phi$$ (for $$m\neq0$$)
    - **Swirl energy density** $$\rho_{E}=\tfrac12\rho_f\|\mathbf v\|^2$$
    - **Swirl-Clock** $$S_t=\sqrt{1-\|\mathbf v\|^2/c^2}$$
    - **Swirl potential** on slice: $$\Phi(r)=-g_{\mathrm{swirl}}/r$$

- **R/T Superpositions (electron $$m=\pm|m|$$)**  
  Interactively superpose $$m=+|m|$$ (R) and $$m=-|m|$$ (T) with amplitudes $$|a|,|b|$$ and phase $$\delta$$; animate
  $$
  \Psi=a\,\psi_{+|m|}e^{-i\omega t}+b\,\psi_{-|m|}e^{-i(\omega t+\delta)}.
  $$

- **Knot Lab**  
  Load **Fourier-series** knots from simple `.fseries` files and render curvature-colored 3D lines. Compare knot geometry to orbital nodal patterns. Optional “glow” effect for depth and clarity.

---

## Quick Start

    # Node 18+ recommended
    npm install
    npm run dev

Open the local URL printed by Vite.

### Optional: Knot data

Place your knot files under `public/knots/`:

    public/
      knots/
        index.json
        3_1.fseries
        5_2.fseries
        6_1.fseries
        ...

**Example `public/knots/index.json`:**

    {
      "files": [
        {"label": "3_1", "path": "3_1.fseries"},
        {"label": "5_2", "path": "5_2.fseries"},
        {"label": "6_1", "path": "6_1.fseries"}
      ]
    }

`*.fseries` format (one or multiple blocks), each data line holds six numbers per harmonic $$n$$:  
`a_x b_x a_y b_y a_z b_z`  
Lines beginning with `%` start a new block. Empty line ends a block.

> If your canonical data lives under `src/data/SST_Mathematical_Proof_Python/Knots_FourierSeries/...`, copy or symlink the files into `public/knots/` for the browser.

---

## UI Guide

- **Orbitals**: choose $$n,\ell,m$$ presets (e.g., `4f, m=0`, `2p, m=±1`).
- **Intersector**: moves the XZ slice plane.
- **Color By**: $$|\psi|^2$$ · $$\rho_E$$ · $$S_t$$ (SST overlays).
- **SST Mode**: switches $$a_0\to a_{\mathrm{SST}}$$ and uses $$g_{\mathrm{swirl}}$$ for energies.
    - **β (beta)**: calibration factor in $$g_{\mathrm{swirl}}=\beta F^{\max}_{\text{Coul}} r_c^2$$.  
      With $$F^{\max}_{\text{Coul}}=29.053507\,\mathrm{N}$$ and $$r_c=1.40897017\times10^{-15}\,\mathrm{m}$$,  
      $$\beta=4$$ reproduces the Bohr radius and Rydberg ladder numerically.
- **R/T Superposition**: toggle mix, set $$|a|,|b|,\delta$$; optional time animation.
- **Knot Lab**: enable, toggle knots by label, optional curvature “glow”.

---

## Hydrogenic Wavefunctions (QM baseline)

For a central time-independent potential, the stationary states separate:
$$
\psi_{nlm}(\mathbf r) = R_{nl}(r)\,Y_\ell^{m}(\theta,\phi)
$$
with
$$
R_{n\ell}(r)=
\left(\frac{2Z}{n a}\right)^{3/2}
\sqrt{\frac{(n-\ell-1)!}{2n\,(n+\ell)!}}\,
e^{-\rho/2}\,\rho^\ell\,
L^{2\ell+1}_{\,n-\ell-1}(\rho),
\quad
Y_{\ell}^{m}(\theta,\phi)=
(-1)^m\sqrt{\frac{2\ell+1}{4\pi}\frac{(\ell-m)!}{(\ell+m)!}}
\,P_\ell^m(\cos\theta)\,e^{im\phi},
$$
where $$\rho=\tfrac{2Zr}{n a}$$.  
**QM mode:** $$a=a_0$$ (Bohr radius).  
**SST mode:** $$a=a_{\mathrm{SST}}=\hbar^2/(\mu g_{\mathrm{swirl}})$$ (see below).

### Example: $$n=4,\ \ell=3,\ m=0$$

Using the usual normalization and a plotting scale substitution, one convenient implicit surface form is
$$
e^{-\alpha r}\big(5z^3-3z r^2\big)=\pm \varepsilon,
$$
which yields the familiar two **toroidal** lobes near the origin and two **outer** lobes on the $$\pm z$$ axis. The cross-section panel shows the corresponding $$|\psi|^2$$ profile; in SST mode you may instead color by $$\rho_E$$ or $$S_t$$.

---

## SST Mapping (scales and overlays)

**Scale replacement**
$$
a_{\mathrm{SST}}=\frac{\hbar^2}{\mu\,g_{\mathrm{swirl}}},\qquad
g_{\mathrm{swirl}}=\beta\,F^{\max}_{\text{Coul}}\,r_c^{\,2},
$$
units: $$[g_{\mathrm{swirl}}]=\mathrm{J\cdot m}$$, $$[a_{\mathrm{SST}}]=\mathrm{m}$$.  
Energies:
$$
E_n=-\frac{\mu\,g_{\mathrm{swirl}}^{\,2}}{2\hbar^2}\frac{1}{n^2}.
$$

**Swirl kinematics (from the $$e^{im\phi}$$ phase)**
$$
\mathbf v(\mathbf r)=\frac{\hbar\,m}{\mu\,r\sin\theta}\,\mathbf e_\phi,\quad
\rho_{E}=\frac12\rho_f\|\mathbf v\|^2,\quad
S_t=\sqrt{1-\|\mathbf v\|^2/c^2},\quad
\Phi(r)=-\frac{g_{\mathrm{swirl}}}{r}.
$$
These overlays are available in **SST Mode**. For $$m=0$$, $$\mathbf v=0$$ (no azimuthal flow).

---

## Knot Lab (Fourier-Series Curves)

Each knot is defined by trigonometric series
$$x(s)=\sum_{n=1}^{N}\big(a_x^{(n)}\cos ns+b_x^{(n)}\sin ns\big)$$
$$y(s)=\sum_{n=1}^{N}\big(a_y^{(n)}\cos ns+b_y^{(n)}\sin ns\big)$$
$$z(s)=\sum_{n=1}^{N}\big(a_z^{(n)}\cos ns+b_z^{(n)}\sin ns\big)$$
$$\quad s\in[0,2\pi]$$
with optional multiple blocks per file; the longest block is used by default.

Curvature (used for color mapping) is computed discretely from Frenet–Serret:
$$\kappa(s)=\frac{\|\mathbf r'(s)\times\mathbf r''(s)\|}{\|\mathbf r'(s)\|^3}.$$

---

## Physically Intuitive Analogy (optional)

Think of an orbital as a **fog** showing where a fast, tiny ring tends to be. In SST mode, the fog’s **color** can show how fast that ring is swirling ($$\rho_E$$) or how its **clock** runs ($$S_t$$). The Knot Lab shows **reference loops** (like different rubber-band shapes) to compare against the orbital’s nodal patterns.

---

## References (BibTeX)

    @article{Schrodinger1926,
      author = {Schr{"o}dinger, Erwin},
      title = {Quantisierung als Eigenwertproblem I--IV},
      journal = {Annalen der Physik},
      year = {1926},
      doi = {10.1002/andp.19263840404}
    }

    @article{Madelung1927,
      author = {Madelung, Erwin},
      title = {Quantentheorie in hydrodynamischer Form},
      journal = {Zeitschrift f{"u}r Physik},
      year = {1927},
      volume = {40},
      pages = {322--326},
      doi = {10.1007/BF01400372}
    }

    @book{ArfkenWeber2013,
      author = {Arfken, George B. and Weber, Hans J. and Harris, Frank E.},
      title = {Mathematical Methods for Physicists},
      edition = {7},
      publisher = {Academic Press},
      year = {2013}
    }

    @book{BransdenJoachain2003,
      author = {Bransden, B. H. and Joachain, C. J.},
      title = {Physics of Atoms and Molecules},
      edition = {2},
      publisher = {Prentice Hall},
      year = {2003}
    }

    @article{BerryDennis2001,
      author = {Berry, M. V. and Dennis, M. R.},
      title = {Knotted and linked phase singularities in monochromatic waves},
      journal = {Proceedings of the Royal Society A},
      year = {2001},
      volume = {457},
      pages = {2251--2263},
      doi = {10.1098/rspa.2001.0822}
    }

    @article{Kedia2013,
      author = {Kedia, Hridesh and Bialynicki-Birula, Iwo and Peralta-Salas, Daniel and Irvine, William T. M.},
      title = {Tying knots in light fields},
      journal = {Physical Review Letters},
      year = {2013},
      volume = {111},
      number = {15},
      pages = {150404},
      doi = {10.1103/PhysRevLett.111.150404}
    }

    @book{Saffman1992,
      author = {Saffman, Philip G.},
      title = {Vortex Dynamics},
      publisher = {Cambridge University Press},
      year = {1992}
    }

---

## License

MIT (see `LICENSE`).

---

### Notes

- **Units & consistency:** All SST expressions above are SI; dimensions of $$g_{\mathrm{swirl}}$$ and $$a_{\mathrm{SST}}$$ are explicitly checked.
- **Calibration:** $$\beta$$ is an exposed parameter; $$\beta=4$$ matches Bohr/Rydberg numerics with the provided canonical constants.
- The viewer works fully in **QM mode** without any SST data; **SST mode** and **Knot Lab** are independent toggles.
