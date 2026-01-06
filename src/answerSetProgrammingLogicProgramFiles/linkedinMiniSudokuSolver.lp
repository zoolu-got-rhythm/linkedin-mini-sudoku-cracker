row(1..6).
col(1..6).
value(1..6).

1 { assign(R,C,V) : value(V) } 1 :- row(R), col(C).

:- assign(R,C1,V), assign(R,C2,V), C1 != C2.
:- assign(R1,C,V), assign(R2,C,V), R1 != R2.

:- assign(R1,C1,V), assign(R2,C2,V),
   (R1-1)/2 == (R2-1)/2,
   (C1-1)/3 == (C2-1)/3,
   (R1,C1) != (R2,C2).

#show assign/3.