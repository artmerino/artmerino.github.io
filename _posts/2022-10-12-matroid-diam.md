---
layout: post
title: Matroid diameter v/s shortest path
date: 2022-10-12 11:12:00-0400
description: 
tags: matroids diameter shortest-path
categories: post
---
$\gdef\cI{\mathcal{I}}$

Let $M_1=(E,\cI_1)$ and $M_2=(E,\cI_2)$ be two matroids over the same groundset $E$.
The *matroid union* of $M_1$ and $M_2$ is a *new* matroid $M_1 \lor M_2$ over the ground set $E$ where the independent sets are the sets which can be partitioned into an independent set of $M_1$ and an independent set of $M_2$.
More formally,

$$
I \in \cI \iff I= I_1 \cup I_2 \text{ s.t. }I_1 \cap I_2 =\emptyset \text{, }I_1 \in \cI_1 \text{ and }I_2 \in \cI_2.
$$

The matroid union theorem guarantees that this is indeed a matroid and that 

**Theorem:** 


**Distance problem on the 


**Diameter problem on the base polytope:**

Given a matroid $M=(E,\cI)$ find two bases $B_1$, $B_2$ such that $|B_1 \Delta B_2|$.

